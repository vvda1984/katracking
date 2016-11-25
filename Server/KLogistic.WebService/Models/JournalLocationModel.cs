using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalLocationModel : BaseModel
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
      
        public JournalLocationModel() { }

        public JournalLocationModel(JournalLocation item)
        {
            JournalId = item.JournalId;
            DriverId = item.DriverId;
            TruckId = item.TruckId;
            Latitude = item.Latitude;
            Longitude = item.Longitude;
            Accuracy = item.Accuracy;
            StopCount = item.StopCount;
            CreatedTS = item.CreatedTS;
            LastUpdatedTS = item.LastUpdatedTS;
        }
    }
}