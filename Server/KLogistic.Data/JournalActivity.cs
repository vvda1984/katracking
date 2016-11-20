using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace KLogistic.Data
{
    [Table("JournalActivities")]
    public partial class JournalActivity
    {
        [Key, Column("JournalActivityId")]
        public long Id { get; set; }

        public long JournalId { get; set; }

        public long UserId { get; set; }

        public long ActivityId { get; set; }

        [StringLength(512)]
        public string ActivityDetail { get; set; }

        [Column(TypeName = "xml")]
        public string ExtendedData { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        public virtual Activity Activity { get; set; }

        public virtual Driver Driver { get; set; }

        public virtual Journal Journal { get; set; }
    }
}
