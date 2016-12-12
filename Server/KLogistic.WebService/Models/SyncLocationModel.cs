using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SyncLocationModel
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
        public string CreatedTS { get; set; }

        [DataMember(Name = "address")]
        public string Address { get; set; }
    }
}