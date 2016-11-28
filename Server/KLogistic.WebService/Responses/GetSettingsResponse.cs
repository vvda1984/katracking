using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetSettingsResponse : BaseResponse
    {
        [DataMember(Name = "items")]
        public List<SettingModel> Items { get; set; }
    }
}