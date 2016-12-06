namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Drivers")]
    public partial class Driver : User
    {
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
    }
}
