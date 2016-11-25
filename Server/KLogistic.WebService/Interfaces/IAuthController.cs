using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IAuthService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "signin", ResponseFormat = WebMessageFormat.Json)]
        SigninResponse Signin(SigninRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "signout", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse Signout(BaseRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "changePassword", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse ChangePassword(ChangePasswordRequest request);
    }
}
