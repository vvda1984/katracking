namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("JournalAttachments")]
    public partial class JournalAttachment
    {
        [Key, Column("AttachmentId")]
        public long Id { get; set; }

        public long JournalId { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        public byte[] Data { get; set; }

        public string DataBase64 { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        public virtual Journal Journal { get; set; }
    }
}
