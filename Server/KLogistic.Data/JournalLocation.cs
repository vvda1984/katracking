using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace KLogistic.Data
{
    [Table("JournalLocations")]  
    public partial class JournalLocation
    {
        [Key]
        [Column(Order = 0)]
        public long JournalId { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long UserId { get; set; }

        public long? TruckId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public double Accuracy { get; set; }

        public int StopCount { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        public virtual Driver Driver { get; set; }

        public virtual Journal Journal { get; set; }

        public virtual Truck Truck { get; set; }
    }
}
