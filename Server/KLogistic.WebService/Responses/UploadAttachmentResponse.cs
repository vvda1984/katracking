using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class UploadAttachmentResponse : BaseResponse
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "attachmentId")]
        public long AttachmentId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }
    }
}