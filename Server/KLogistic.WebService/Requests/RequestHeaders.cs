using System.ComponentModel;

namespace KLogistic.WebService
{
    public enum RequestHeaders
    {
        [Description("token")]
        Token,

        [Description("username")]
        Username,

        [Description("password")]
        Password,

        [Description("Oldpassword")]
        OldPassword,

        [Description("newpassword")]
        NewPassword,

        [Description("driverId")]
        DriverId,

        [Description("firstName")]
        FirstName,

        [Description("lastName")]
        LastName,

        [Description("ssn")]
        Ssn,

        [Description("address")]
        Address,

        [Description("dob")]
        Dob,

        [Description("phone")]
        Phone,

        [Description("email")]
        Email,

        [Description("note")]
        Note,

        [Description("licenseNo")]
        LicenseNo,

        [Description("classType")]
        ClassType,

        [Description("issuedPlace")]
        IssuedPlace,

        [Description("expiredDate")]
        ExpiredDate,

        [Description("issuedDate")]
        IssuedDate,

        [Description("journalId")]
        JournalId,

        [Description("attachmentId")]
        AttachmentId,

        [Description("fileName")]
        FileName,

        [Description("status")]
        Status,

        [Description("includeActivity")]
        IncludeActivity,

        [Description("includeAttachment")]
        IncludeAttachment,

        [Description("includeStopPoint")]
        IncludeStopPoint,

        [Description("includeDriver")]
        IncludeDriver,

        [Description("name")]
        Name,

        [Description("startLocation")]
        StartLocation,

        [Description("startLat")]
        StartLat,

        [Description("startLng")]
        StartLng,

        [Description("endLocation")]
        EndLocation,

        [Description("endLat")]
        EndLat,

        [Description("endLng")]
        EndLng,

        [Description("activeDate")]
        ActiveDate,

        [Description("extendedData")]
        ExtendedData,

        [Description("description")]
        Description,

        [Description("truckid")]
        TruckId,

        [Description("longitude")]
        Latitude,

        [Description("longitude")]
        Longitude,

        [Description("accuracy")]
        Accuracy,

        [Description("stopPointId")]
        StopPointId,

        [Description("number")]
        Number,

        [Description("UserId")]
        UserId,

        [Description("role")]
        Role
    }
}