using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Linq;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        public GetDriversResponse GetDrivers(ServiceRequest request)
        {
            return Run<ServiceRequest, GetDriversResponse>(request, (resp, db, session) =>
            {
                resp.Items = new System.Collections.Generic.List<DriverModel>();
                var users = db.GetDrivers().ToList();
                foreach (var user in users)
                    resp.Items.Add(new DriverModel(user));
            });
        }

        public GetDriverResponse GetDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, GetDriverResponse>(request, (resp, db, session) =>
            {                
                if (request.DriverId != null)
                {
                    var user = db.GetDriver(request.DriverId.Value);
                    if (user == null)
                        throw new KException("Driver is not found");

                    resp.Item = new DriverModel(user);
                }
                else
                    throw new KException("Missing user id paramter");
            });
        }

        public BaseResponse UpdateDriver(ServiceRequest request)
        {            
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {                
                ValidateParam(request.DriverId);
                long driverId = request.DriverId.Value;

                var driver = db.GetDriver(driverId);
                if (driver == null)
                    throw new KException("Driver is not found");

                string firstName = request.FirstName;
                string lastName = request.LastName;
                string ssn = request.Ssn;
                string address = request.Address;
                string dob = request.Dob;
                string phone = request.Phone;
                string email = request.Email;
                string note = request.Note;
                string licenseNo = request.LicenseNo;
                string classType = request.ClassType;
                string issuedPlace = request.IssuedPlace;
                string expiredDate = request.ExpiredDate;
                string issuedDate = request.IssuedDate;
                int? status = request.Status;

                if (firstName != null) driver.FirstName = firstName;
                if (lastName != null) driver.LastName = lastName;
                if (ssn != null) driver.SSN = ssn;
                if (address != null) driver.Address = address;
                if (dob != null) driver.DOB = DateTime.ParseExact(request.Dob, "yyyy-MM-dd", null); //dob.Value;
                if (phone != null) driver.Phone = phone;
                if (email != null) driver.Email = email;
                if (note != null) driver.Note = note;
                if (licenseNo != null) driver.Note = licenseNo;
                if (classType != null) driver.Note = classType;
                if (issuedPlace != null) driver.Note = issuedPlace;
                if (expiredDate != null) driver.ExpiredDate = DateTime.ParseExact(request.ExpiredDate, "yyyy-MM-dd", null);
                if (issuedDate != null) driver.IssuedDate = DateTime.ParseExact(request.IssuedDate, "yyyy-MM-dd", null);
                if (status != null) driver.Status = (Status)status.Value;
            });
        }

        public GetDriverResponse AddDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, GetDriverResponse>(request, (resp, db, session) =>
            {
                //ValidateParam(request.DriverId);
                //long driverId = request.DriverId.Value;

                string username = request.UserName;
                string password = request.Password;
                string firstName = request.FirstName;
                string lastName = request.LastName;
                string ssn = request.Ssn;
                string address = request.Address;
                string dob = request.Dob;
                string phone = request.Phone;
                string email = request.Email;
                string note = request.Note;
                string licenseNo = request.LicenseNo;
                string classType = request.ClassType;
                string issuedPlace = request.IssuedPlace;
                string expiredDate = request.ExpiredDate;
                string issuedDate = request.IssuedDate;
                int? status = request.Status;

                var user = db.GetUser(username);
                if (user != null)
                    throw new KException($"Driver {username} existed!");

                var driver = new Driver();
                driver.Username = username;
                driver.Password = Utils.HashPassword(password);
                driver.FirstName = firstName;
                driver.LastName = lastName;
                driver.SSN = ssn;
                driver.Address = address;
                driver.DOB = DateTime.ParseExact(request.Dob, "yyyy-MM-dd", null);//request.Dob?? request.Dob.Value;
                driver.Phone = phone;
                driver.Email = email;
                driver.Note = note;
                driver.Role = UserRole.Driver;
                driver.LicenseNo = licenseNo;
                driver.ClassType = classType;
                driver.IssuedPlace = issuedPlace;
                driver.ExpiredDate = DateTime.ParseExact(request.ExpiredDate, "yyyy-MM-dd", null);
                driver.IssuedDate = DateTime.ParseExact(request.IssuedDate, "yyyy-MM-dd", null);
                driver.LastUpdatedTS = DateTime.Now;
                driver.CreatedTS = DateTime.Now;
                driver.Status = (status != null) ? (Status)status.Value : Status.Actived;

                db.AddDriver(driver);

                db.SaveChanges();
                resp.Item = new DriverModel(driver);
            }, false);
        }

        public BaseResponse BlockDriver(ServiceRequest request)
        {           
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.DriverId);
                long driverId = request.DriverId.Value;

                var user = db.GetDriver(driverId);
                if (user == null)
                    throw new KException("Driver is not found");

                user.Status = Status.Blocked;
                user.LastUpdatedTS = DateTime.Now;
            }, false);
        }

        public BaseResponse UnblockDriver(ServiceRequest request)
        {           
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.DriverId);
                long driverId = request.DriverId.Value;

                var user = db.GetDriver(driverId);
                if (user == null)
                    throw new KException("Driver is not found");

                user.Status = Status.Actived;
                user.LastUpdatedTS = DateTime.Now;
            }, false);
        }

        public GetDriversResponse GetBlockedDrivers(ServiceRequest request)
        {          
            return Run<ServiceRequest, GetDriversResponse>(request, (resp, db, session) =>
            {
                resp.Items = new System.Collections.Generic.List<DriverModel>();
                var users = db.GetBlockedDrivers().ToList();
                foreach (var user in users)
                    resp.Items.Add(new DriverModel(user));
            }, false);
        }

        public BaseResponse RemoveDriver(ServiceRequest request)
        {            
            return Run<ServiceRequest, GetDriversResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.DriverId);
                long driverId = request.DriverId.Value;

                var user = db.GetDriver(driverId);
                if (user == null)
                    throw new KException("Driver is not found");

                if (user.Status == Status.Inactived)
                    db.RemoveUser(user);
                else
                {
                    user.Status = Status.Deleted;
                    user.LastUpdatedTS = DateTime.Now;
                }

            }, false);
        }

        public BaseResponse RestoreDriver(ServiceRequest request)
        {           
            return Run<ServiceRequest, GetDriversResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.DriverId);
                long driverId = request.DriverId.Value;

                var user = db.GetDriver(driverId);
                if (user == null)
                    throw new KException("Driver is not found");

                user.Status = Status.Actived;
                user.LastUpdatedTS = DateTime.Now;
            }, false);
        }
    }
}