using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface ITruckService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "gettrucks", ResponseFormat = WebMessageFormat.Json)]
        GetTrucksResponse GetTrucks(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "gettruck", ResponseFormat = WebMessageFormat.Json)]
        GetTruckResponse GetTruck(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "updatetruck", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse UpdateTruck(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addtruck", ResponseFormat = WebMessageFormat.Json)]
        GetTruckResponse AddTruck(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "blocktruck", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse BlockTruck(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "unblocktruck", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse UnblockTruck(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getblockedtrucks", ResponseFormat = WebMessageFormat.Json)]
        GetTrucksResponse GetBlockedTrucks(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removetruck", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RemoveTruck(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "restoretruck", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RestoreTruck(ServiceRequest request);
    }
}
