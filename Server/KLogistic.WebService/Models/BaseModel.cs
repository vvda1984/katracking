using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class BaseModel
    {
        [DataMember(Name = "createdTS")]
        public DateTime CreatedTS { get; set; }

        [DataMember(Name = "lastUpdatedTS")]
        public DateTime LastUpdatedTS { get; set; }

        [DataMember(Name = "extendedProperties")]
        public List<ExtendedDataModel> ExtendedProperties { get; set; }

        protected void SetExtendedProperties(string value)
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                ExtendedProperties = new List<ExtendedDataModel>();

            }
        }
    }
}