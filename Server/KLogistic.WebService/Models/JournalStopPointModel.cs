using KLogistic.Data;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalStopPointModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "latitude")]
        public double Latitude { get; set; }

        [DataMember(Name = "longitude")]
        public double Longitude { get; set; }

        [DataMember(Name = "extendedData")]
        public string ExtendedData { get; set; }

        public JournalStopPointModel() { }

        public JournalStopPointModel(JournalStopPoint journal)
        {
            Id = journal.Id;
            JournalId = journal.JournalId;
            Name = journal.Name;
            Description = journal.Description;
            Latitude = journal.Latitude;
            Longitude = journal.Longitude;
            ExtendedData = journal.ExtendedData;
        }
    }
}

