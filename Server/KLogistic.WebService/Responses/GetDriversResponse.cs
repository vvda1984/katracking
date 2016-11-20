using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetDriversResponse : Response
    {
        [DataMember(Name = "items")]
        public List<DriverModel> Items { get; set; }
    }
}