﻿using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class ServiceRequest : BaseRequest
    {
        [DataMember]
        public string UserName { get; set; }

        [DataMember]
        public string Password { get; set; }

        [DataMember]
        public long? DriverId { get; set; }

        [DataMember]
        public string FirstName { get; set; }

        [DataMember]
        public string LastName { get; set; }

        [DataMember]
        public string Ssn { get; set; }

        [DataMember]
        public string Address { get; set; }

        //[DataMember]
        //public DateTime? DobTS { get; set; }

        [DataMember]
        public string Dob { get; set; }

        [DataMember]
        public string Phone { get; set; }

        [DataMember]
        public string Email { get; set; }

        [DataMember]
        public string Note { get; set; }

        [DataMember]
        public string LicenseNo { get; set; }

        [DataMember]
        public string ClassType { get; set; }

        [DataMember]
        public string IssuedPlace { get; set; }

        [DataMember]
        public string ExpiredDate { get; set; }

        [DataMember]
        public string IssuedDate { get; set; }

        [DataMember]
        public long? JournalId { get; set; }

        [DataMember]
        public long? AttachmentId { get; set; }

        [DataMember]
        public string FileName { get; set; }

        [DataMember]
        public int? Status { get; set; }

        [DataMember]
        public bool? IncludeActivity { get; set; }

        [DataMember]
        public bool? IncludeAttachment { get; set; }

        [DataMember]
        public bool? IncludeStopPoint { get; set; }

        [DataMember]
        public bool? IncludeDriver { get; set; }

        [DataMember]
        public string Name { get; set; }

        [DataMember]
        public string StartLocation { get; set; }

        [DataMember]
        public double? StartLat { get; set; }

        [DataMember]
        public double? StartLng { get; set; }

        [DataMember]
        public string EndLocation { get; set; }

        [DataMember]
        public double? EndLat { get; set; }

        [DataMember]
        public double? EndLng { get; set; }

        [DataMember]
        public string ActiveDate { get; set; }

        [DataMember]
        public string ExtendedData { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public long? TruckId { get; set; }

        [DataMember]
        public double? Latitude { get; set; }

        [DataMember]
        public double? Longitude { get; set; }

        [DataMember]
        public double? Accuracy { get; set; }

        [DataMember]
        public long? StopPointId { get; set; }

        [DataMember]
        public string Number { get; set; }

        [DataMember]
        public long? UserId { get; set; }

        [DataMember]
        public int? Role { get; set; }

        [DataMember]
        public long? ActivityId { get; set; }

        [DataMember]
        public string ActivityMessage { get; set; }

        [DataMember]
        public string CreatedTS { get; set; }

        [DataMember]
        public int? StopCount { get; set; }

        [DataMember]
        public string ReferenceCode { get; set; }

        [DataMember]
        public string EstimatedDuration { get; set; }

        [DataMember]
        public string EstimatedDistance { get; set; }

        [DataMember(Name = "extendedProperties")]
        public List<ExtendedDataModel> ExtendedProperties { get; set; }

        [DataMember]
        public string Mooc { get; set; }

        [DataMember]
        public string Container { get; set; }

        [DataMember]
        public string EstimatedJournal { get; set; }

        [DataMember]
        public long? RouteId { get; set; }

        [DataMember]
        public string RoutePoints { get; set; }
    }
}