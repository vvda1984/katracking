namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Journals")]
    public partial class Journal
    {
        public Journal()
        {
        }

        [Key, Column("JournalId")]
        public long Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

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
        public string ExtendedData { get; set; }

        public string ReferenceCode { get; set; }

        public string EstimatedDuration { get; set; }

        public string EstimatedDistance { get; set; }

        public string EstimatedJournal { get; set; }

        public string Mooc { get; set; }
     
        public string Container { get; set; }
        
        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }
        
        public long? RouteId { get; set; }

        public virtual JournalRoute Route { get; set; }

        public virtual ICollection<JournalActivity> JournalActivities { get; set; }

        public virtual ICollection<JournalAttachment> JournalAttachments { get; set; }

        public virtual ICollection<JournalDriver> JournalDrivers { get; set; }

        public virtual ICollection<JournalLocation> JournalLocations { get; set; }

        //public virtual ICollection<JournalLocation> JournalLocations1 { get; set; }

        public virtual ICollection<JournalStopPoint> JournalStopPoints { get; set; }
    }
}
