using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class JourneyModel : BaseModel
    {
        [DataMember(Name = "journalId")]
        public long JournalId { get; set; }

        [DataMember(Name = "driverId")]
        public long DriverId { get; set; }

        [DataMember(Name = "truckId")]
        public long TruckId { get; set; }

        [DataMember(Name = "driver")]
        public UserModel Driver { get; set; }

        [DataMember(Name = "truck")]
        public TruckModel Truck { get; set; }

        [DataMember(Name = "locations")]
        public List<JournalLocationModel> Locations { get; set; }

        public JourneyModel() { Locations = new List<JournalLocationModel>(); }
    }
}