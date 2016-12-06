using System.Collections.Generic;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetJournalDriversResponse : BaseResponse
    {
        [DataMember(Name = "items")]
        public List<JournalDriverModel> Items { get; set; }
    }
}