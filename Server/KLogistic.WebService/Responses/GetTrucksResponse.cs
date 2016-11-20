using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetTrucksResponse : Response
    {
        [DataMember(Name = "items")]
        public List<TruckModel> Items { get; set; }
    }
}