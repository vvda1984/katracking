using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalLocationModel
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "driverId")]
        public long DriverId { get; set; }

        [DataMember(Name = "truckId")]
        public long TruckId { get; set; }

        [DataMember(Name = "latitude")]
        public double Latitude { get; set; }

        [DataMember(Name = "longitude")]
        public double Longitude { get; set; }

        [DataMember(Name = "accuracy")]
        public double Accuracy { get; set; }

        [DataMember(Name = "stopCount")]
        public int StopCount { get; set; }

        [DataMember(Name = "createdTS")]
        public DateTime CreatedTS { get; set; }

        [DataMember(Name = "lastUpdatedTS")]
        public DateTime LastUpdatedTS { get; set; }

        public JournalLocationModel() { }

        public JournalLocationModel(JournalLocation item)
        {
            JournalId = item.JournalId;
            DriverId = item.UserId;
            TruckId = item.TruckId ?? item.TruckId.Value;
            Latitude = item.Latitude;
            Longitude = item.Longitude;
            Accuracy = item.Accuracy;
            StopCount = item.StopCount;
            CreatedTS = item.CreatedTS;
            LastUpdatedTS = item.LastUpdatedTS;
        }
    }
}