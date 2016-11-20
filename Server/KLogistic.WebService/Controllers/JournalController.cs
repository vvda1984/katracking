using KLogistic.Core;
using KLogistic.Data;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Data.Entity;

namespace KLogistic.WebService
{
    public partial class KAService
    {       
        private Journal GetJournal(DataContext db, long journalid)
        {
            if (journalid <= 0)
                throw new KException("Missing parameter 'journalid'");

            var journal = db.DBModel.Journals.FirstOrDefault(x => x.Id == journalid);
            if (journal == null)
                throw new KException("Journal is not found");

            return journal;
        }

        private JournalModel CreateJournalModel(Journal journal, bool includeActivity = false, bool includeAttachment = false, bool includeStopPoint = false, bool includeDriver = false)
        {
            var item = new JournalModel(journal);
            if (includeActivity)
                foreach (var i in journal.JournalActivities)
                    item.Activities.Add(new JournalActivityModel(i));

            if (includeAttachment)
                foreach (var i in journal.JournalAttachments)
                    item.Attachments.Add(new JournalAttachmentModel(i));

            if (includeStopPoint)
                foreach (var i in journal.JournalStopPoints)
                    item.StopPoints.Add(new JournalStopPointModel(i));

            if (includeDriver)
                foreach (var i in journal.JournalDrivers)
                    item.Drivers.Add(new JournalDriverModel(i));

            return item;
        }

        public GetJournalsResponse GetJournals(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalsResponse>(request, (resp, db, session) =>
            {
                var status = request.Status;
                var includeActivity = request.IncludeActivity;
                var includeAttachment = request.IncludeAttachment;
                var includeStopPoint = request.IncludeStopPoint;
                var includeDriver = request.IncludeDriver;
                //int includeLocation = GetHeaderParam("includeLocation", 0);

                resp.Items = new List<JournalModel>();
                var query = (status != null) ?
                        db.DBModel.Journals.Where(x => x.Status != JournalStatus.Deleted) :
                        db.DBModel.Journals.Where(x => x.Status == (JournalStatus)status);
                foreach (var journal in query)
                    resp.Items.Add(CreateJournalModel(journal,
                            includeActivity??includeActivity.Value,
                            includeAttachment ?? includeAttachment.Value,
                            includeStopPoint ?? includeStopPoint.Value,
                            includeDriver ?? includeDriver.Value));
             });
        }

        public GetJournalResponse GetJournal(ServiceRequest request)
        {          
            return Run<ServiceRequest, GetJournalResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;

                var includeActivity = request.IncludeActivity;
                var includeAttachment = request.IncludeAttachment;
                var includeStopPoint = request.IncludeStopPoint;
                var includeDriver = request.IncludeDriver;

                var journal = GetJournal(db, journalid);
                resp.item = CreateJournalModel(journal,
                                includeActivity ?? includeActivity.Value,
                                includeAttachment ?? includeAttachment.Value,
                                includeStopPoint ?? includeStopPoint.Value,
                                includeDriver ?? includeDriver.Value);
        });
        }

        public Response UpdateJournal(ServiceRequest request)
        {       
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;

                var journal = GetJournal(db, journalid);

                string name = request.Name;
                string startLocation = request.StartLocation;
                double startLat = request.StartLat ?? request.StartLat.Value;
                double startLng = request.StartLng?? request.StartLng.Value;
                string endLocation = request.EndLocation;
                double endLat = request.EndLat ?? request.EndLat.Value;
                double endLng = request.EndLng ?? request.EndLng.Value;
                DateTime? activeDate = request.ActiveDate;
                int status = request.Status != null ? request.Status.Value : -1;
                string extendedData = request.ExtendedData;
                string description = request.Description;

                if (name != null) journal.Name = name;
                if (description != null) journal.Description = description;
                if (startLocation != null) journal.StartLocation = startLocation;
                if (startLat > 0) journal.StartLat = startLat;
                if (startLng > 0) journal.StartLng = startLng;
                if (endLocation != null) journal.EndLocation = endLocation;
                if (endLat > 0) journal.EndLat = endLat;
                if (endLng > 0) journal.EndLng = endLng;
                if (activeDate != null) journal.ActiveDate = request.ActiveDate.Value;
                if (extendedData != null) journal.ExtendedData = extendedData;
                if (status >= 0) journal.Status = (JournalStatus)status;

                journal.LastUpdatedTS = DateTime.Now;
            });
        }

        public GetJournalResponse AddJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;

                string name = request.Name;
                string startLocation = request.StartLocation;
                double startLat = request.StartLat ?? request.StartLat.Value;
                double startLng = request.StartLng ?? request.StartLng.Value;
                string endLocation = request.EndLocation;
                double endLat = request.EndLat ?? request.EndLat.Value;
                double endLng = request.EndLng ?? request.EndLng.Value;
                DateTime? activeDate = request.ActiveDate;
                int status = request.Status != null ? request.Status.Value : -1;
                string extendedData = request.ExtendedData;
                string description = request.Description;

                var journal = new Journal();

                journal.Name = name;
                journal.Description = description;
                journal.StartLocation = startLocation;
                journal.StartLat = startLat;
                journal.StartLng = startLng;
                journal.EndLocation = endLocation;
                journal.EndLat = endLat;
                journal.EndLng = endLng;
                journal.ActiveDate = activeDate != null ? activeDate.Value : DateTime.Now;
                journal.ExtendedData = extendedData;
                journal.Status = (JournalStatus)status;
                journal.CreatedTS = DateTime.Now;
                journal.LastUpdatedTS = DateTime.Now;

                journal.Validate();

                db.DBModel.Journals.Add(journal);
                db.SaveChanges();

                resp.item = new JournalModel(journal);
            }, false);
        }

        public Response RemoveJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;

                var journal = GetJournal(db, journalid);
                if (journal.Status == JournalStatus.Initial)
                {
                    db.DBModel.Journals.Remove(journal);
                }
                else
                {
                    journal.Status = JournalStatus.Deleted;
                    journal.LastUpdatedTS = DateTime.Now;
                }
            });
        }

        public GetJourneyResponse GetJourney(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJourneyResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;
                ValidateParam(request.DriverId);
                long driverid = request.DriverId.Value;

                var locations = db.DBModel.JournalLocations.Include(x=>x.Driver).Where(x=>x.UserId == driverid && x.JournalId == journalid).ToList();
                if (locations.Any())
                {
                    resp.Item = new JourneyModel();
                    resp.Item.Locations = new List<JournalLocationModel>();
                    resp.Item.Driver = new DriverModel(locations[0].Driver);
                    foreach (var i in locations)
                        resp.Item.Locations.Add(new JournalLocationModel(i));
                }
            });
        }

        public Response AddJournalLocation(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJourneyResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;

                ValidateParam(request.DriverId);
                long driverid = request.DriverId.Value;

                long? truckid = request.TruckId;

                double lat = request.Latitude.Value;
                double lng = request.Longitude.Value;
                double acc = request.Accuracy.Value;

                bool addNewLocation = true;
                var lastLocation = db.DBModel.JournalLocations.LastOrDefault();
                if (lastLocation != null)
                {
                    var distance = Utils.CalcDistance(lat, lng, lastLocation.Latitude, lastLocation.Longitude);
                    if (distance < Constants.AcceptedDistance)
                    {
                        lastLocation.StopCount++;
                        lastLocation.LastUpdatedTS = DateTime.Now;
                        addNewLocation = false;
                    }
                }
                
                if(addNewLocation)
                {
                    JournalLocation location = new JournalLocation
                    {
                        Accuracy = acc,
                        Latitude = lat,
                        Longitude = lng,
                        CreatedTS = DateTime.Now,
                        LastUpdatedTS = DateTime.Now,
                        UserId = driverid,
                        JournalId = journalid,
                        StopCount = 0,
                    };

                    if (truckid > 0)
                        location.TruckId = truckid;

                    db.DBModel.JournalLocations.Add(location);
                }
            });
        }
    }
}