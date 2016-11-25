using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IUserService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getusers", ResponseFormat = WebMessageFormat.Json)]
        GetUsersResponse GetUsers(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getuser", ResponseFormat = WebMessageFormat.Json)]
        GetUserResponse GetUser(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "updateuser", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse UpdateUser(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "adduser", ResponseFormat = WebMessageFormat.Json)]
        GetUserResponse AddUser(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "blockuser", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse BlockUser(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "unblockuser", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse UnblockUser(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getblockedusers", ResponseFormat = WebMessageFormat.Json)]
        GetUsersResponse GetBlockedUsers(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removeuser", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RemoveUser(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "restoreuser", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RestoreUser(ServiceRequest request);
    }
}
