using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class ActivityModel 
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "createdTS")]
        public DateTime CreatedTS { get; set; }

        [DataMember(Name = "lastUpdatedTS")]
        public DateTime LastUpdatedTS { get; set; }

        public ActivityModel() { }

        public ActivityModel(Activity item) {
            Id = item.Id;
            Name = item.Name;
            Description = item.Description;
            CreatedTS = item.CreatedTS;
            LastUpdatedTS = item.LastUpdatedTS;
        }
    }
}