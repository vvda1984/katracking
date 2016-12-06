namespace KLogistic.Data
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class KdbModel : DbContext
    {
        public KdbModel()
            : base("name=KdbContext")
        {
        }

        public virtual DbSet<Activity> Activities { get; set; }
        public virtual DbSet<AppSession> AppSessions { get; set; }
        public virtual DbSet<Driver> Drivers { get; set; }
        public virtual DbSet<JournalActivity> JournalActivities { get; set; }
        public virtual DbSet<JournalAttachment> JournalAttachments { get; set; }
        public virtual DbSet<JournalDriver> JournalDrivers { get; set; }
        public virtual DbSet<JournalLocation> JournalLocations { get; set; }
        public virtual DbSet<Journal> Journals { get; set; }
        public virtual DbSet<JournalStopPoint> JournalStopPoints { get; set; }
        public virtual DbSet<Setting> Settings { get; set; }
        public virtual DbSet<Truck> Trucks { get; set; }
        public virtual DbSet<User> Users { get; set; }
    }
}
