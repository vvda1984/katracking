using System.ServiceModel;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    [ServiceContract]
    public interface IJournalService
    {
        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJournals", ResponseFormat = WebMessageFormat.Json)]
        GetJournalsResponse GetJournals(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getjournal", ResponseFormat = WebMessageFormat.Json)]
        GetJournalResponse GetJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "updateJournal", ResponseFormat = WebMessageFormat.Json)]
        Response UpdateJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addJournal", ResponseFormat = WebMessageFormat.Json)]
        GetJournalResponse AddJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removeJournal", ResponseFormat = WebMessageFormat.Json)]
        Response RemoveJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJourney", ResponseFormat = WebMessageFormat.Json)]
        GetJourneyResponse GetJourney(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addJournalLocation", ResponseFormat = WebMessageFormat.Json)]
        Response AddJournalLocation(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJournalStopPoints", ResponseFormat = WebMessageFormat.Json)]
        GetStopPointsResponse GetJournalStopPoints(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        GetStopPointResponse GetJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "updateJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        Response UpdateJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        GetStopPointResponse AddJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removeJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        Response RemoveJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removeAllJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        Response RemoveAllJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getAttachments", ResponseFormat = WebMessageFormat.Json)]
        GetAttachmentsResponse GetAttachments(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "uploadAttachment", ResponseFormat = WebMessageFormat.Json)]
        UploadAttachmentResponse UploadAttachment(UploadAttachmentRequest attachment);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "downloadAttachment", ResponseFormat = WebMessageFormat.Json)]
        GetAttachmentResponse DownloadAttachment(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "deleteAttachment", ResponseFormat = WebMessageFormat.Json)]
        Response DeleteAttachment(ServiceRequest request);
    }
}
