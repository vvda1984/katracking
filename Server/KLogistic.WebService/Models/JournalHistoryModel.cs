using KLogistic.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalHistoryModel : BaseModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "startLocation")]
        public string StartLocation { get; set; }

        [DataMember(Name = "startLat")]
        public double StartLat { get; set; }

        [DataMember(Name = "startLng")]
        public double StartLng { get; set; }

        [DataMember(Name = "endLocation")]
        public string EndLocation { get; set; }

        [DataMember(Name = "endLat")]
        public double EndLat { get; set; }

        [DataMember(Name = "endLng")]
        public double EndLng { get; set; }

        [DataMember(Name = "activeDate")]
        public DateTime ActiveDate { get; set; }

        [DataMember(Name = "totalDistance")]
        public double TotalDistance { get; set; }

        [DataMember(Name = "totalDuration")]
        public double TotalDuration { get; set; }

        [DataMember(Name = "status")]
        public int Status { get; set; }

        [DataMember(Name = "extendedData")]
        public string ExtendedData { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "stopPoints")]
        public List<JournalStopPointModel> StopPoints { get; set; }

        [DataMember(Name = "activities")]
        public List<JournalActivityModel> Activities { get; set; }

        [DataMember(Name = "truckJourneys")]
        public List<JournalTruckJourneyModel> TruckJourneys { get; set; }

        public JournalHistoryModel() { }

        public JournalHistoryModel(Journal journal, bool includeActivity = true)
        {
            Id = journal.Id;
            Name = journal.Name;
            StartLocation = journal.StartLocation;
            StartLat = journal.StartLat;
            StartLng = journal.StartLng;
            EndLocation = journal.EndLocation;
            EndLat = journal.EndLat;
            EndLng = journal.EndLng;
            ActiveDate = journal.ActiveDate;
            Status = (int)journal.Status;
            ExtendedData = journal.ExtendedData;
            Description = journal.Description;
            LastUpdatedTS = journal.LastUpdatedTS;
            CreatedTS = journal.CreatedTS;

            StopPoints = new List<JournalStopPointModel>();
            Activities = new List<JournalActivityModel>();
            ExtendedProperties = new List<ExtendedDataModel>();
            TruckJourneys = new List<JournalTruckJourneyModel>();

            if (includeActivity)
                foreach (var a in journal.JournalActivities)
                    Activities.Add(new JournalActivityModel(a));

            foreach (var a in journal.JournalStopPoints)
                StopPoints.Add(new JournalStopPointModel(a));

            var dict = new Dictionary<long, Tuple<JournalTruckJourneyModel, List<GeoPoint>>>();
            foreach(var i in journal.JournalLocations)
            {
                Tuple<JournalTruckJourneyModel, List<GeoPoint>> item = null;
                if (!dict.ContainsKey(i.TruckId))
                {
                    var model = new JournalTruckJourneyModel
                    {
                        JournalId = journal.Id,
                        DriverId = i.UserId,
                        DriverName = $"{i.User.FirstName} {i.User.LastName}",
                        TruckId = i.TruckId,
                        TruckName = i.Truck.TruckName,
                        TruckNumber = i.Truck.TruckNumber,
                    };
                    item = new Tuple<JournalTruckJourneyModel, List<GeoPoint>>(model, new List<GeoPoint>());
                    TruckJourneys.Add(model);
                    dict.Add(i.TruckId, item);
                }
                else
                    item = dict[i.TruckId];
                item.Item1.LastAddress = i.Address;
                item.Item1.LastLat = i.Latitude;
                item.Item1.LastLng = i.Longitude;
                item.Item2.Add(new GeoPoint { Lat = i.Latitude, Lng = i.Longitude });
            }

            foreach (var kvp in dict)
            {
                kvp.Value.Item1.Polyline = JsonConvert.SerializeObject(kvp.Value.Item2,
                    new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            }
        }
    }

    [DataContract]
    public class JournalTruckJourneyModel
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "driverid")]
        public long DriverId { get; set; }

        [DataMember(Name = "driverName")]
        public string DriverName { get; set; }        

        [DataMember(Name = "truckId")]
        public long TruckId { get; set; }

        [DataMember(Name = "truckName")]
        public string TruckName { get; set; }

        [DataMember(Name = "truckNumber")]
        public string TruckNumber { get; set; }

        [DataMember(Name = "lastAddress")]
        public string LastAddress { get; set; }

        [DataMember(Name = "lastLat")]
        public double LastLat { get; set; }

        [DataMember(Name = "lastLng")]
        public double LastLng { get; set; }

        [DataMember(Name = "polyline")]
        public string Polyline { get; set; }
    }
}