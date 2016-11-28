using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IConfigService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getSettings", ResponseFormat = WebMessageFormat.Json)]
        GetSettingsResponse GetSettings(BaseRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "submitSettings", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse SubmitSettings(SubmitSettingsRequest request);
    }
}
