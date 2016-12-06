namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("AppSessions")]
    public partial class AppSession
    {
        [Key, Column("SessionId")]
        public long Id { get; set; }

        public long UserId { get; set; }

        [StringLength(1024)]
        public string SessionData { get; set; }

        [Required]
        [StringLength(64)]
        public string Token { get; set; }

        public SessionStatus Status { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        public virtual User User { get; set; }
    }
}
