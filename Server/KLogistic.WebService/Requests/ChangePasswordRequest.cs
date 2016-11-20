using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class ChangePasswordRequest : Request
    {
        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public string CurrentPassword { get; set; }

        [DataMember]
        public string NewPassword { get; set; }
    }
}