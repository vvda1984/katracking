using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetDriverResponse : Response
    {
        [DataMember(Name = "item")]
        public DriverModel Item { get; set; }
    }
}