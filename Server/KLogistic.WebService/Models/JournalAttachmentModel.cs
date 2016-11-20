using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalAttachmentModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "data")]
        public string Data { get; set; }

        [DataMember(Name = "createdTS")]
        public DateTime CreatedTS { get; set; }

        [DataMember(Name = "lastUpdatedTS")]
        public DateTime LastUpdatedTS { get; set; }

        public JournalAttachmentModel() { }

        public JournalAttachmentModel(JournalAttachment item)
        {
            Id = item.Id;
            JournalId = item.JournalId;
            Data = item.DataBase64;
            Name = item.Name;
            CreatedTS = item.CreatedTS;
            LastUpdatedTS = item.LastUpdatedTS;
        }
    }

    [DataContract]
    public class JournalAttachmentLiteModel
    {
        [DataMember(Name = "id")]
        public long AttachmentId { get; set; }

        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "createdTS")]
        public DateTime CreatedTS { get; set; }

        [DataMember(Name = "lastUpdatedTS")]
        public DateTime LastUpdatedTS { get; set; }
    }
}