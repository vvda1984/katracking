using FluentScheduler;
using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Linq;
using System.Data.Entity;
using FileHelpers;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Xml.Linq;
using System.Text;

namespace KLogistic.ServiceHost
{
    class ReportService : IBackgroundProcess
    {
        public void Start()
        {
            JobManager.Initialize(new ReportRegistry());
            JobManager.Start();
        }

        public void Stop()
        {
            JobManager.Stop();
        }
    }

    class ReportRegistry : Registry
    {
        public ReportRegistry() : base()
        {
            var setting = AppSettings.Current.GetString("Report1:Settings");
            NameValueSettings settings = new NameValueSettings(setting);

            // Schedule an IJob to run at an interval
            Schedule<Report1Job>().ToRunNow().AndEvery(settings.Get("repeat", 10)).Minutes();
        }
    }

    class Report1Job : IJob
    {        
        private JournalRow[] ToJournalRows(DataContext db, Journal journal, ref bool isDBChanged)
        {
            //Shipment code: CZ.BN9.16 - Truck No: 29C33224 - Time: 09:23:35 19/09/2016
            //Truck No    29C33224
            //Total Km	680
            //Time	09:23:02 19/09/2016
            //Current Location    X.Yên Trung, Yên Phong, Bắc Ninh
            //Cont No TRLU7005737
            //Seal    F1085651
            //Shipment code CZ.BN9.16
            //Destination KA GARAGAE
            //Estimated distance to Destination (Km)  50,16
            //Note

            List<JournalRow> rows = new List<JournalRow>();

            string shipCode = journal.Name;
            string estimatedDistance = journal.EstimatedDistance;
            string estimatedDuration = journal.EstimatedDuration;
            string time = DateTime.Now.ToString("HH:mm:ss dd/MM/yyyy");
            string start = journal.StartLocation;
            string end = journal.EndLocation;

            if (string.IsNullOrEmpty(estimatedDistance))
            {
                var result = GDirectionService.Current.GetTimeAndDistance(journal.StartLat, journal.StartLng, journal.EndLat, journal.EndLng);
                if(!result.IsError)
                {
                    isDBChanged = true;
                    estimatedDistance = journal.EstimatedDuration = result.DurationText;
                    estimatedDuration = journal.EstimatedDistance = result.DistanceText;
                    isDBChanged = true;
                }
            }

            foreach(var driver in journal.JournalDrivers)
            {
                var lastLocation = journal.JournalLocations.LastOrDefault(x => x.UserId == driver.UserId);
                if (lastLocation != null)
                {
                    var estimationDistanceToDestination = "";
                    var result = GDirectionService.Current.GetTimeAndDistance(lastLocation.Latitude, lastLocation.Longitude, journal.EndLat, journal.EndLng);
                    if (!result.IsError)
                        estimationDistanceToDestination = result.DistanceText;

                    rows.Add(new JournalRow
                    {
                        Shipmentcode = shipCode,
                        TruckNo = lastLocation.Truck.TruckNumber,
                        DriverName = $"{driver.User.FirstName} {driver.User.LastName}",
                        Start = journal.StartLocation,
                        Destination = journal.EndLocation,
                        TotalDistance = estimatedDistance,
                        TotalDuration = estimatedDuration,
                        CurrentLocation = lastLocation.Address,
                        EstimatedDistanceToDestination = estimationDistanceToDestination,
                        Note = journal.Description,
                    });
                }
            }   

            return rows.ToArray();
        }

        private EmailTemplate GetEmailTemplate()
        {
            string exePath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            string file = Path.Combine(exePath, "Templates", "Report1_EmailTemplate");
            string content = "";
            if (File.Exists(file))
                content = File.ReadAllText(file);
            else
            {
                content = @"<div data-subject='KA Reporting Service - Journal Status'>
                          <p>Dear admin</p>
                          <p>Please see the attachement for status of current journals.</p>
                          <p>Regards,</p>
                          <p>Reporting Service<br />
                          KA Logistic<br />
                          </p>
                        </div>";
            }

            var emailTemplate = new EmailTemplate() { Body = content };
            try
            {
                var xdoc = XDocument.Parse(emailTemplate.Body);
                emailTemplate.Subject = (string)xdoc.Root.Attribute("data-subject");
            }
            catch
            {
                emailTemplate.Subject = "KA Reporting Service - Journal Status";
            }
            return emailTemplate;
        }

        public void Execute()
        {
            Console.WriteLine("Execute");
            try
            {
                var setting = AppSettings.Current.GetString("Report1:Settings");
                NameValueSettings settings = new NameValueSettings(setting);

                var email = settings.Get("email");
                if (string.IsNullOrEmpty(email))
                    Console.WriteLine("Email was not configured");
                else
                {
                    EmailTemplate template = null;
                    using (var db = new DataContext())
                    {
                        var journals = db.DBModel.Journals
                            .Include(x => x.JournalDrivers)
                            .Where(x => x.Status == JournalStatus.Started).ToArray();

                        bool isChanged = false;

                        var engine = new FileHelperEngine<JournalRow>();
                        var rows = new List<JournalRow>();
                        rows.Add(new JournalRow
                        {
                            Shipmentcode = "Shipment Code",
                            TruckNo = "Truck No",
                            DriverName = "Driver",
                            Start = "Start",
                            Destination = "Destination",
                            TotalDistance = "Total Distance",
                            TotalDuration = "Total Duration",
                            CurrentLocation = "Current Location",
                            EstimatedDistanceToDestination = "Estimated Distance To Destination",
                            Note = "Note",
                        });

                        foreach (var journal in journals)
                        {
                            var journalRows = ToJournalRows(db, journal, ref isChanged);
                            if (journalRows.Length > 0)
                                rows.AddRange(journalRows);
                        }

                        //MemoryStream ms = new MemoryStream();
                        string fileContent = engine.WriteString(rows);
                        string fileName = $"JournalStatus{DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss")}.csv";

                        // Email
                        if (template == null)
                            template = GetEmailTemplate();

                        (new SmtpEmailService()).SendMail(
                            email,
                            template,
                            new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                            {
                            },
                            new List<Tuple<string, Stream>>()
                            {
                                new Tuple<string, Stream>(fileName, new MemoryStream( Encoding.Unicode.GetBytes(fileContent))),
                            });

                        if (isChanged) db.SaveChanges();
                        //ms.Dispose();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error:", ex.GetFullMessage());
            }
            finally
            {
                Console.WriteLine("Sleep to next run");
            }
        }
    }
}
