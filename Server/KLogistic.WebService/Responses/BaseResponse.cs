using Autofac;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class BaseResponse
    {
        [DataMember(Name = "status")]
        public int Status { get; set; }

        //[DataMember(Name = "errorMessage")]
        [DataMember]
        public string ErrorMessage { get; set; }

        public static void RegisterResponses(ContainerBuilder cb)
        {
            cb.Register(c => new BaseResponse()).As<BaseResponse>();
            cb.Register(c => new GetAttachmentResponse()).As<GetAttachmentResponse>();
            cb.Register(c => new GetAttachmentsResponse()).As<GetAttachmentsResponse>();
            cb.Register(c => new GetDriverResponse()).As<GetDriverResponse>();
            cb.Register(c => new GetDriversResponse()).As<GetDriversResponse>();
            cb.Register(c => new GetJournalResponse()).As<GetJournalResponse>();
            cb.Register(c => new GetJournalsResponse()).As<GetJournalsResponse>();
            cb.Register(c => new GetJourneyResponse()).As<GetJourneyResponse>();
            cb.Register(c => new GetStopPointResponse()).As<GetStopPointResponse>();
            cb.Register(c => new GetStopPointsResponse()).As<GetStopPointsResponse>();
            cb.Register(c => new GetTruckResponse()).As<GetTruckResponse>();
            cb.Register(c => new GetTrucksResponse()).As<GetTrucksResponse>();
            cb.Register(c => new GetUserResponse()).As<GetUserResponse>();
            cb.Register(c => new GetUsersResponse()).As<GetUsersResponse>();
            cb.Register(c => new SigninResponse()).As<SigninResponse>();
            cb.Register(c => new UploadAttachmentResponse()).As<UploadAttachmentResponse>();
            cb.Register(c => new GetJournalTrucksResponse()).As<GetJournalTrucksResponse>();
            cb.Register(c => new GetJournalActivitiesResponse()).As<GetJournalActivitiesResponse>();
            cb.Register(c => new GetSettingsResponse()).As<GetSettingsResponse>();
        }
    }
}