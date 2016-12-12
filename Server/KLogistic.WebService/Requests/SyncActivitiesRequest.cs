using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SyncActivitiesRequest : BaseRequest
    {
        [DataMember(Name = "items")]
        public List<SyncActivityModel> Items { get; set; }       
    }
}