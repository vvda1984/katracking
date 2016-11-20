using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class SigninRequest : Request
    {
        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public string Password { get; set; }

        [DataMember]
        public string ClientInfo { get; set; }
    }
}