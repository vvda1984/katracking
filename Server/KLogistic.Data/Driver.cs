using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KLogistic.Data
{
    [Table("Drivers")]
    public partial class Driver : User
    {
        public Driver()
        {
            //JournalActivities = new HashSet<JournalActivity>();
            //JournalDrivers = new HashSet<JournalDriver>();
            //JournalLocations = new HashSet<JournalLocation>();
        }

        [Required]
        [StringLength(20)]
        public string LicenseNo { get; set; }

        [StringLength(10)]
        public string ClassType { get; set; }

        public DateTime? ExpiredDate { get; set; }

        public DateTime? IssuedDate { get; set; }

        [StringLength(100)]
        public string IssuedPlace { get; set; }

        //public virtual User User { get; set; }

        public virtual ICollection<JournalActivity> JournalActivities { get; set; }

        public virtual ICollection<JournalDriver> JournalDrivers { get; set; }

        public virtual ICollection<JournalLocation> JournalLocations { get; set; }
    }
}
