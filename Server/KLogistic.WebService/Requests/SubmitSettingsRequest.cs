using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SubmitSettingsRequest : BaseRequest
    {
        [DataMember(Name = "items")]
        public List<SettingModel> items { get; set; }
    }
}