using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IKAService : 
        IUserService, 
        IDriverService, 
        IAuthService, 
        ITruckService, 
        IJournalService, 
        IConfigService,
        IRouteService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "ping", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse Ping(BaseRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "sendRequest", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse SendRequest();
    }
}
