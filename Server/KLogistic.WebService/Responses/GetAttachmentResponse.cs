using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetAttachmentResponse : BaseResponse
    {
        [DataMember(Name = "item")]
        public JournalAttachmentModel Item { get; set; }
    }
}