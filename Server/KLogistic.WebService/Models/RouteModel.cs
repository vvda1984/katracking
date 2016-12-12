using KLogistic.Core;
using KLogistic.Data;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class RouteModel : BaseModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "points")]
        public List<RoutePointModel> Points { get; set; }
               
        public RouteModel(JournalRoute item)
        {
            Id = item.Id;
            Name = item.Name;
            if (!string.IsNullOrWhiteSpace(item.Data))
            {
                try
                {
                    Points = Serializer.FromJson<List<RoutePointModel>>(item.Data);
                }
                catch
                {
                    Points = new List<RoutePointModel>();
                }
            }
            else
                Points = new List<RoutePointModel>();
        }
    }

    [DataContract]
    public class RoutePointModel
    {
        [DataMember]
        public string Address { get; set; }
        [DataMember]
        public float Lat { get; set; }
        [DataMember]
        public float Lng { get; set; }
        [DataMember]
        public string Distance { get; set; }
        [DataMember]
        public string Duration { get; set; }
    }
}