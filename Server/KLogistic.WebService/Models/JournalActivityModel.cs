using KLogistic.Data;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalActivityModel : BaseModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

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

        [DataMember(Name = "driver")]
        public UserModel Driver { get; set; }

        [DataMember(Name = "activity")]
        public ActivityModel Activity { get; set; }

        public JournalActivityModel() { }

        public JournalActivityModel(JournalActivity item)
        {
            Id = item.Id;
            JournalId = item.JournalId;
            DriverId = item.UserId;
            ActivityId = item.ActivityId;
            ActivityName = item.Activity.Name;
            ActivityDetail = item.ActivityDetail;
            ExtendedData = item.ExtendedData;
            CreatedTS = item.CreatedTS;
            LastUpdatedTS = item.LastUpdatedTS;
            Activity = new ActivityModel(item.Activity);
            Driver = new UserModel(item.User);
        }
    }
}