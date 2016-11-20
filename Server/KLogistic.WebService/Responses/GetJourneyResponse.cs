using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetJourneyResponse : Response
    {
        [DataMember(Name = "item")]
        public JourneyModel Item { get; set; }
    }
}