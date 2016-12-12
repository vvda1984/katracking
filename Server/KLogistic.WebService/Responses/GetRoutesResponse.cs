using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetRoutesResponse : BaseResponse
    {
        [DataMember(Name = "items")]
        public List<RouteModel> Items { get; set; }
    }
}