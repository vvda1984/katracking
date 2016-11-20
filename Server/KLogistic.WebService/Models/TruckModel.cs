using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class TruckModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "number")]
        public string Number { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        public TruckModel()
        {
        }

        public TruckModel(Truck truck)
        {
            Id = truck.Id;
            Name = truck.TruckName;
            Number = truck.TruckNumber;
            Description = truck.Description;
        }
    }
}