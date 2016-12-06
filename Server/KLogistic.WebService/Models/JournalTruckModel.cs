using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalTruckModel : BaseModel
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "driverid")]
        public long DriverId { get; set; }
        
        [DataMember(Name = "truckId")]
        public long TruckId { get; set; }

        [DataMember(Name = "truckName")]
        public string TruckName { get; set; }

        [DataMember(Name = "truckNumber")]
        public string TruckNumber { get; set; }

        [DataMember(Name = "truckDescription")]
        public string TruckDescription { get; set; }

        [DataMember(Name = "truckStatus")]
        public int TruckStatus { get; set; }

        [DataMember(Name = "journalName")]
        public string JournalName { get; set; }

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

        [DataMember(Name = "journalStatus")]
        public int JournalStatus { get; set; }

        [DataMember(Name = "extendedData")]
        public string ExtendedData { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "stopPoints")]
        public List<JournalStopPointModel> StopPoints { get; set; }

        [DataMember(Name = "lastLat")]
        public double LastLat { get; set; }

        [DataMember(Name = "lastLng")]
        public double LastLng { get; set; }

        [DataMember(Name = "lastAddress")]
        public string LastAddress { get; set; }

        [DataMember(Name = "lastStopCount")]
        public long LastStopCount { get; set; }

        [DataMember(Name = "warningMessage")]
        public string WarningMessage { get; set; }

        public JournalTruckModel() { }
    }
}