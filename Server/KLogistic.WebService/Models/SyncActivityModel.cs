using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SyncActivityModel
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "truckId")]
        public long TruckId { get; set; }

        [DataMember(Name = "driverId")]
        public long DriverId { get; set; }

        [DataMember(Name = "activityId")]
        public long ActivityId { get; set; }

        [DataMember(Name = "activityName")]
        public string ActivityName { get; set; }

        [DataMember(Name = "activityDetail")]
        public string ActivityDetail { get; set; }

        [DataMember(Name = "extendedData")]
        public string ExtendedData { get; set; }

        [DataMember(Name = "createdTS")]
        public string CreatedTS { get; set; }
    }
}