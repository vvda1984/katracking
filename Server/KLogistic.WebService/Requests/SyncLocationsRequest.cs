using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SyncLocationsRequest : BaseRequest
    {       
        [DataMember(Name = "items")]
        public List<SyncLocationModel> Items { get; set; }
    }
}