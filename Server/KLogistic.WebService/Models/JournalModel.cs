using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JournalModel : BaseModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "startLocation")]
        public string StartLocation { get; set; }

        [DataMember(Name = "startLat")]
        public double StartLat { get; set; }

        [DataMember(Name = "startLng")]
        public double StartLng { get; set; }

        [DataMember(Name = "endLocation")]
        public string EndLocation { get; set; }

        [DataMember(Name = "endLat")]
        public double EndLat { get; set; }

        [DataMember(Name = "endLng")]
        public double EndLng { get; set; }

        [DataMember(Name = "activeDate")]
        public DateTime ActiveDate { get; set; }

        [DataMember(Name = "totalDistance")]
        public double TotalDistance { get; set; }

        [DataMember(Name = "totalDuration")]
        public double TotalDuration { get; set; }

        [DataMember(Name = "status")]
        public int Status { get; set; }

        [DataMember(Name = "extendedData")]
        public string ExtendedData { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "stopPoints")]
        public List<JournalStopPointModel> StopPoints { get; set; }

        [DataMember(Name = "activities")]
        public List<JournalActivityModel> Activities { get; set; }

        [DataMember(Name = "attachments")]
        public List<JournalAttachmentModel> Attachments { get; set; }

        [DataMember(Name = "drivers")]
        public List<JournalDriverModel> Drivers { get; set; }

        public JournalModel() { }

        public JournalModel(Journal journal)
        {
            Id = journal.Id;
            Name = journal.Name;
            StartLocation = journal.StartLocation;
            StartLat = journal.StartLat;
            StartLng = journal.StartLng;
            EndLocation = journal.EndLocation;
            EndLat = journal.EndLat;
            EndLng = journal.EndLng;
            ActiveDate = journal.ActiveDate;
            Status = (int)journal.Status;
            ExtendedData = journal.ExtendedData;
            Description = journal.Description;
            LastUpdatedTS = journal.LastUpdatedTS;
            CreatedTS = journal.CreatedTS;

            StopPoints = new List<JournalStopPointModel>();
            Activities = new List<JournalActivityModel>();
            Attachments = new List<JournalAttachmentModel>();
            Drivers = new List<JournalDriverModel>();
        }
    }
}