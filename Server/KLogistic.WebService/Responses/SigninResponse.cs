using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SigninResponse : BaseResponse
    {
        [DataMember(Name = "user")]
        public UserModel User { get; set; }

        [DataMember(Name = "token")]
        public string Token { get; set; }

        [DataMember(Name = "truck")]
        public TruckModel Truck { get; set; }
    }
}