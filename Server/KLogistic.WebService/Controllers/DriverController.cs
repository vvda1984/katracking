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

        public Response UpdateDriver(ServiceRequest request)
        {            
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
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
                DateTime? dob = request.Dob;
                string phone = request.Phone;
                string email = request.Email;
                string note = request.Note;
                string licenseNo = request.LicenseNo;
                string classType = request.ClassType;
                string issuedPlace = request.IssuedPlace;
                DateTime? expiredDate = request.ExpiredDate;
                DateTime? issuedDate = request.IssuedDate;

               
              
                if (firstName != null) driver.FirstName = firstName;
                if (lastName != null) driver.LastName = lastName;
                if (ssn != null) driver.SSN = ssn;
                if (address != null) driver.Address = address;
                if (dob != null) driver.DOB = dob.Value;
                if (phone != null) driver.Phone = phone;
                if (email != null) driver.Email = email;
                if (note != null) driver.Note = note;
                if (licenseNo != null) driver.Note = licenseNo;
                if (classType != null) driver.Note = classType;
                if (issuedPlace != null) driver.Note = issuedPlace;
                if (expiredDate != null) driver.ExpiredDate = expiredDate.Value;
                if (issuedDate != null) driver.IssuedDate = issuedDate.Value;
            });
        }

        public GetDriverResponse AddDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, GetDriverResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.DriverId);
                long driverId = request.DriverId.Value;

                string username = request.UserName;
                string firstName = request.FirstName;
                string lastName = request.LastName;
                string ssn = request.Ssn;
                string address = request.Address;
                DateTime? dob = request.Dob;
                string phone = request.Phone;
                string email = request.Email;
                string note = request.Note;
                string licenseNo = request.LicenseNo;
                string classType = request.ClassType;
                string issuedPlace = request.IssuedPlace;
                DateTime? expiredDate = request.ExpiredDate;
                DateTime? issuedDate = request.IssuedDate;

                var user = db.GetUser(username);
                if (user != null)
                    throw new KException($"Driver {username} existed!");

                var driver = new Driver();
                driver.Username = username;
                driver.FirstName = firstName;
                driver.LastName = lastName;
                driver.SSN = ssn;
                driver.Address = address;
                driver.DOB = request.Dob?? request.Dob.Value;
                driver.Phone = phone;
                driver.Email = email;
                driver.Note = note;
                driver.Role = UserRole.Driver;
                driver.LicenseNo = licenseNo;
                driver.ClassType = classType;
                driver.IssuedPlace = issuedPlace;
                driver.ExpiredDate = request.ExpiredDate ?? request.Dob.Value;
                driver.IssuedDate = request.IssuedDate ?? request.Dob.Value;
                driver.LastUpdatedTS = DateTime.Now;
                driver.CreatedTS = DateTime.Now;

                db.AddDriver(driver);

                db.SaveChanges();
                resp.Item = new DriverModel(driver);
            }, false);
        }

        public Response BlockDriver(ServiceRequest request)
        {           
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
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

        public Response UnblockDriver(ServiceRequest request)
        {           
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
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

        public Response RemoveDriver(ServiceRequest request)
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

        public Response RestoreDriver(ServiceRequest request)
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