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
        [WebInvoke(Method = "POST", UriTemplate = "getJournal", ResponseFormat = WebMessageFormat.Json)]
        GetJournalResponse GetJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "updateJournal", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse UpdateJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addJournal", ResponseFormat = WebMessageFormat.Json)]
        GetJournalResponse AddJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removeJournal", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RemoveJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJourney", ResponseFormat = WebMessageFormat.Json)]
        GetJourneyResponse GetJourney(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addJournalLocation", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse AddJournalLocation(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJournalStopPoints", ResponseFormat = WebMessageFormat.Json)]
        GetStopPointsResponse GetJournalStopPoints(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        GetStopPointResponse GetJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "updateJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse UpdateJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        GetStopPointResponse AddJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removeJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RemoveJournalStopPoint(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "removeAllJournalStopPoint", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse RemoveAllJournalStopPoint(ServiceRequest request);

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
        BaseResponse DeleteAttachment(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJournalTrucks", ResponseFormat = WebMessageFormat.Json)]
        GetJournalTrucksResponse GetJournalTrucks(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getJourneyByTruck", ResponseFormat = WebMessageFormat.Json)]
        GetJourneyResponse GetJourneyByTruck(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "startJournal", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse StartJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "endJournal", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse EndJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "returnJournal", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse ReturnJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "trackJournal", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse TrackJournal(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "getDriverJournals", ResponseFormat = WebMessageFormat.Json)]
        GetJournalsResponse GetJournalsOfDriver(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "addJournalActivity", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse AddJournalActivity(ServiceRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "syncLocations", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse SyncLocations(SyncLocationsRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "syncActivities", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse SyncActivities(SyncActivitiesRequest request);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "syncJournal", ResponseFormat = WebMessageFormat.Json)]
        BaseResponse SyncJournal(SyncRequest request);
    }
}
