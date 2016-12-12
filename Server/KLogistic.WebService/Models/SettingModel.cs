using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SettingModel : BaseModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "value")]
        public string Value { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        public SettingModel() { }

        public SettingModel(Setting item) {
            Id = item.Id;
            Name = item.Name;
            Value = item.Value;
            Description = item.Description;
            CreatedTS = item.CreatedTS;
            LastUpdatedTS = item.LastUpdatedTS;                        
        }
    }
}