using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KLogistic.Data
{
    [Table("Journals")]
    public partial class Journal
    {
        public Journal()
        {
            //JournalActivities = new HashSet<JournalActivity>();
            //JournalAttachments = new HashSet<JournalAttachment>();
            //JournalDrivers = new HashSet<JournalDriver>();
            //JournalLocations = new HashSet<JournalLocation>();
        }

        [Key, Column("JournalId")]
        public long Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string StartLocation { get; set; }

        public double StartLat { get; set; }

        public double StartLng { get; set; }

        [Required]
        [StringLength(255)]
        public string EndLocation { get; set; }

        public double EndLat { get; set; }

        public double EndLng { get; set; }

        [Column(TypeName = "date")]
        public DateTime ActiveDate { get; set; }

        [EnumDataType(typeof(JournalStatus))]
        public JournalStatus Status { get; set; }

        [Column(TypeName = "xml")]
        [Required]
        public string ExtendedData { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        public virtual ICollection<JournalActivity> JournalActivities { get; set; }

        public virtual ICollection<JournalAttachment> JournalAttachments { get; set; }

        public virtual ICollection<JournalDriver> JournalDrivers { get; set; }

        public virtual ICollection<JournalLocation> JournalLocations { get; set; }

        public virtual ICollection<JournalStopPoint> JournalStopPoints { get; set; }

        public void Validate()
        {

        }
    }
}
