using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SyncRequest : BaseRequest
    {
        [DataMember(Name = "activities")]
        public List<SyncActivityModel> Activities { get; set; }

        [DataMember(Name = "locations")]
        public List<SyncLocationModel> Locations { get; set; }
    }
}