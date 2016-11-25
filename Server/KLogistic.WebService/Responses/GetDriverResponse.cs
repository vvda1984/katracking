using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetDriverResponse : BaseResponse
    {
        [DataMember(Name = "item")]
        public DriverModel Item { get; set; }
    }
}