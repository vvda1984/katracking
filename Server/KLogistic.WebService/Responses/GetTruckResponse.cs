using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetTruckResponse : Response
    {
        [DataMember(Name = "item")]
        public TruckModel Item { get; set; }
    }
}