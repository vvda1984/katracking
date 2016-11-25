using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetUsersResponse : BaseResponse
    {
        [DataMember(Name = "items")]
        public List<UserModel> Items { get; set; }
    }
}