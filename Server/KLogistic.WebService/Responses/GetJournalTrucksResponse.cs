using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetJournalTrucksResponse : BaseResponse
    {
        [DataMember(Name = "items")]
        public List<JournalTruckModel> Items { get; set; }
    }
}