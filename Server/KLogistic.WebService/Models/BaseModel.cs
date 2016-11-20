using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class BaseModel
    {
        [DataMember(Name = "token")]
        public string token { get; set; }
    }
}