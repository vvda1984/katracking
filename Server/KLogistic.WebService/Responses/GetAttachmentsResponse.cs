using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetAttachmentsResponse : BaseResponse
    {
        [DataMember(Name = "items")]
        public List<JournalAttachmentLiteModel> Items { get; set; }
    }
}