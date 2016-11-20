using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;


namespace KLogistic.Data
{
    [Table("Settings")]
    public partial class Setting
    {
        [Key, Column("SettingId")]
        public long Id { get; set; }
       
        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        public string Value { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }
    }
}
