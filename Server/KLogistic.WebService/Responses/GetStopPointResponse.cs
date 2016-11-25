using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetStopPointResponse : BaseResponse
    {
        [DataMember(Name = "item")]
        public JournalStopPointModel Item { get; set; }
    }
}