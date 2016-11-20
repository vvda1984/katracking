using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class Request
    {
        [DataMember(Name = "token")]
        public string Token { get; set; }
    }
}