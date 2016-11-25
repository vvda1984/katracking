using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetJournalResponse : BaseResponse
    {
        [DataMember(Name = "item")]
        public JournalModel item { get; set; }
    }
}