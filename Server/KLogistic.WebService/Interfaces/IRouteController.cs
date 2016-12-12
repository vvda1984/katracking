using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IRouteService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "GetRoutes", ResponseFormat = WebMessageFormat.Json)]
        GetRoutesResponse GetRoutes(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "GetRoute", ResponseFormat = WebMessageFormat.Json)]
        GetRouteResponse GetRoute(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "UpdateRoute", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse UpdateRoute(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "AddRoute", ResponseFormat = WebMessageFormat.Json)]
        GetRouteResponse AddRoute(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "RemoveRoute", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RemoveRoute(ServiceRequest request);
    }
}
