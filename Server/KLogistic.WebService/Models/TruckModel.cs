using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class TruckModel : BaseModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "number")]
        public string Number { get; set; }

        [DataMember(Name = "description")]
        public string Description { get; set; }

        [DataMember(Name = "status")]
        public int Status { get; set; }

        public TruckModel()
        {
        }

        public TruckModel(Truck truck)
        {
            Id = truck.Id;
            Name = truck.TruckName;
            Number = truck.TruckNumber;
            Description = truck.Description;
            Status = (int)truck.Status;
            LastUpdatedTS = truck.LastUpdatedTS;
            CreatedTS = truck.CreatedTS;
        }
    }
}