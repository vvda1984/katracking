using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetRouteResponse : BaseResponse
    {
        [DataMember(Name = "item")]
        public RouteModel Item { get; set; }
    }
}