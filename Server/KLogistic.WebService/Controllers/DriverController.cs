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

                if (request.FirstName != null) driver.FirstName = request.FirstName;
                if (request.LastName != null) driver.LastName = request.LastName;
                if (request.Ssn != null) driver.SSN = request.Ssn;
                if (request.Address != null) driver.Address = request.Address;
                if (request.Dob != null) driver.DOB = DateTime.ParseExact(request.Dob, "yyyy-MM-dd", null); //dob.Value;
                if (request.Phone != null) driver.Phone = request.Phone;
                if (request.Email != null) driver.Email = request.Email;
                if (request.Note != null) driver.Note = request.Note;
                if (request.LicenseNo != null) driver.LicenseNo = request.LicenseNo;
                if (request.ClassType != null) driver.ClassType = request.ClassType;
                if (request.IssuedPlace != null) driver.IssuedPlace = request.IssuedPlace;
                if (request.ExpiredDate != null) driver.ExpiredDate = DateTime.ParseExact(request.ExpiredDate, "yyyy-MM-dd", null);
                if (request.IssuedDate != null) driver.IssuedDate = DateTime.ParseExact(request.IssuedDate, "yyyy-MM-dd", null);
                if (request.Status != null) driver.Status = (Status)request.Status.Value;
                if (request.TruckId != null) driver.TruckId = request.TruckId;
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
                long? truckId = request.TruckId;

                var existingUser = db.GetUser(username);
                if (existingUser != null)
                    throw new KException($"Driver {username} existed!");

                var driver = new Driver()
                {
                    Username = username,
                    Password = Utils.HashPassword(password),
                    FirstName = firstName,
                    LastName = lastName,
                    SSN = ssn,
                    Address = address,
                    DOB = DateTime.ParseExact(request.Dob, "yyyy-MM-dd", null),//request.Dob?? request.Dob.Value;
                    Phone = phone,
                    Email = email,
                    Note = note,
                    Role = UserRole.Driver,
                    LastUpdatedTS = DateTime.Now,
                    CreatedTS = DateTime.Now,
                    Status = (status != null) ? (Status)status.Value : Status.Actived,
                    LicenseNo = licenseNo,
                    ClassType = classType,
                    IssuedPlace = issuedPlace,
                    TruckId = truckId,
                };
                if (expiredDate != null)
                    driver.ExpiredDate = DateTime.ParseExact(request.ExpiredDate, "yyyy-MM-dd", null);

                if (issuedDate != null)
                    driver.IssuedDate = DateTime.ParseExact(request.IssuedDate, "yyyy-MM-dd", null);

                driver.Validate();                
                
                db.AddDriver(driver);
                db.SaveChanges();

                driver.Truck = db.DBModel.Trucks.FirstOrDefault(x => x.Id == truckId);
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

                var driver = db.GetDriver(driverId);
                if (driver == null)
                    throw new KException("Driver is not found");

                if (driver.Status == Status.Inactived)
                {
                    db.RemoveDriver(driver);
                }
                else
                {
                    driver.Status = Status.Deleted;
                    driver.LastUpdatedTS = DateTime.Now;
                }
            });
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