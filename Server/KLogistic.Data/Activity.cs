namespace KLogistic.Data
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Activities")]
    public partial class Activity
    {
        //public Activity()
        //{
        //    JournalActivities = new HashSet<JournalActivity>();
        //}

        [Key, Column("ActivityId")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }

        //public virtual ICollection<JournalActivity> JournalActivities { get; set; }
    }
}
