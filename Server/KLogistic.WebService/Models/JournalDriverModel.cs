using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalDriverModel : BaseModel
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "driverId")]
        public long DriverId { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "status")]
        public int Status { get; set; }

        public JournalDriverModel() { }

        public JournalDriverModel(JournalDriver item)
        {
            JournalId = item.JournalId;
            DriverId = item.UserId;
            Description = item.Description;
            Status = (int)item.Status;
            CreatedTS = item.CreatedTS;
            LastUpdatedTS = item.LastUpdatedTS;
        }
    }
}