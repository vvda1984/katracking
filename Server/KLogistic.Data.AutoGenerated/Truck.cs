namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Trucks")]
    public partial class Truck
    {
        public Truck()
        {
            //JournalLocations = new HashSet<JournalLocation>();
        }

        [Key, Column("TruckId")]
        public long Id { get; set; }

        [Required]
        [StringLength(255)]
        public string TruckName { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        [Required]
        [StringLength(100)]
        public string TruckNumber { get; set; }

        [Column(TypeName = "xml")]
        public string ExtendedData { get; set; }

        [EnumDataType(typeof(TruckStatus))]
        public TruckStatus Status { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        public virtual ICollection<JournalLocation> JournalLocations { get; set; }
    }
}
