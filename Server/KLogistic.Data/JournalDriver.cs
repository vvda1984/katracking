using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KLogistic.Data
{
    [Table("JournalDrivers")]
    public partial class JournalDriver
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long JournalId { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long UserId { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        [EnumDataType(typeof(JournalDriverStatus))]
        public JournalDriverStatus Status { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        public virtual Driver Driver { get; set; }

        public virtual Journal Journal { get; set; }
    }
}
