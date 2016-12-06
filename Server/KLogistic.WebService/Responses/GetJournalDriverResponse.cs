using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetJournalDriverResponse : BaseResponse
    {
        [DataMember(Name = "item")]
        public JournalDriverModel Item { get; set; }
    }
}