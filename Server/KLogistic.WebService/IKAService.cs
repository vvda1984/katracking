using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IKAService : IUserService, IDriverService, IAuthService, ITruckService, IJournalService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "ping", ResponseFormat = WebMessageFormat.Json)]
        Response Ping(Request request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "sendRequest", ResponseFormat = WebMessageFormat.Json)]
        Response SendRequest();
    }
}
