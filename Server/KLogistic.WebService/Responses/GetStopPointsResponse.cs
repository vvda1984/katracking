﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class GetStopPointsResponse : BaseResponse
    {
        [DataMember(Name = "items")]
        public List<JournalStopPointModel> Items { get; set; }
    }
}