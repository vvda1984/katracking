using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class UploadAttachmentRequest : Request
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "data")]
        public string Data { get; set; }
    }
}
