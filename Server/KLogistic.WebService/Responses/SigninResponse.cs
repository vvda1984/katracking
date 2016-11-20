using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SigninResponse : Response
    {
        [DataMember(Name = "user")]
        public UserModel User { get; set; }

        [DataMember(Name = "token")]
        public string Token { get; set; }
    }
}