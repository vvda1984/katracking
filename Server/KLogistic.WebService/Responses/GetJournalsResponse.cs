using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetJournalsResponse : Response
    {
        [DataMember(Name = "items")]
        public List<JournalModel> Items { get; set; }
    }
}