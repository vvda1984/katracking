namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Users")]
    public partial class User
    {
        public User()
        {
            //AppSessions = new HashSet<AppSession>();
            //JournalDrivers = new HashSet<JournalDriver>();
            //JournalLocations = new HashSet<JournalLocation>();
        }

        [Key, Column("UserId")]
        public long Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }

        [EnumDataType(typeof(UserRole))]
        public UserRole Role { get; set; }

        public bool ResetPassword { get; set; }

        [EnumDataType(typeof(Status))]
        public Status Status { get; set; }

        [Required]
        [StringLength(255)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(255)]
        public string LastName { get; set; }

        [StringLength(12)]
        public string SSN { get; set; }

        [StringLength(512)]
        public string Address { get; set; }

        public DateTime? DOB { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(255)]
        public string Email { get; set; }

        [StringLength(512)]
        public string Note { get; set; }

        [Column(TypeName = "xml")]
        public string ExtendedData { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        //public virtual ICollection<AppSession> AppSessions { get; set; }

        //public virtual Driver Driver { get; set; }

        //public virtual ICollection<JournalDriver> JournalDrivers { get; set; }

        //public virtual ICollection<JournalLocation> JournalLocations { get; set; }
    }
}
