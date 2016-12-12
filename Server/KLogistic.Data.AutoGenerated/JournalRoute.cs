namespace KLogistic.Data
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Routes")]
    public partial class JournalRoute
    {
        public JournalRoute()
        {
        }

        [Key, Column("RouteId")]
        public long Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        public string Data { get; set; }

        [EnumDataType(typeof(Status))]
        public Status Status { get; set; }

        public DateTime CreatedTS { get; set; }

        public DateTime LastUpdatedTS { get; set; }
    }
}
