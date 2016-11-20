using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Linq;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        public GetUsersResponse GetUsers(ServiceRequest request)
        {
            return Run<ServiceRequest, GetUsersResponse>(request, (resp, db, session) =>
            {
                resp.Items = new System.Collections.Generic.List<UserModel>();
                var users = db.GetUsers().ToList();
                foreach (var user in users)
                    resp.Items.Add(new UserModel(user));
            });
        }

        public GetUserResponse GetUser(ServiceRequest request)
        {
            return Run<ServiceRequest, GetUserResponse>(request, (resp, db, session) =>
            {
                if (request.UserId != null)
                {
                    var user = db.GetUser(request.UserId.Value);
                    if (user == null)
                        throw new KException("User is not found");

                    resp.Item = new UserModel(user);
                }
                else
                    throw new KException("Missing user id paramter");
            });
        }

        public Response UpdateUser(ServiceRequest request)
        {
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.UserId);
                long driverId = request.UserId.Value;

                var driver = db.GetUser(driverId);
                if (driver == null)
                    throw new KException("User is not found");

                string firstName = request.FirstName;
                string lastName = request.LastName;
                string ssn = request.Ssn;
                string address = request.Address;
                DateTime? dob = request.Dob;
                string phone = request.Phone;
                string email = request.Email;
                string note = request.Note;
            
                if (firstName != null) driver.FirstName = firstName;
                if (lastName != null) driver.LastName = lastName;
                if (ssn != null) driver.SSN = ssn;
                if (address != null) driver.Address = address;
                if (dob != null) driver.DOB = dob.Value;
                if (phone != null) driver.Phone = phone;
                if (email != null) driver.Email = email;
                if (note != null) driver.Note = note;
            });
        }

        public GetUserResponse AddUser(ServiceRequest request)
        {
            return Run<ServiceRequest, GetUserResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.UserId);
                long driverId = request.UserId.Value;

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
                    throw new KException($"User {username} existed!");

                var driver = new User();
                driver.Username = username;
                driver.FirstName = firstName;
                driver.LastName = lastName;
                driver.SSN = ssn;
                driver.Address = address;
                driver.DOB = request.Dob ?? request.Dob.Value;
                driver.Phone = phone;
                driver.Email = email;
                driver.Note = note;
                driver.Role = UserRole.User;
                driver.LastUpdatedTS = DateTime.Now;
                driver.CreatedTS = DateTime.Now;

                db.AddUser(driver);

                db.SaveChanges();
                resp.Item = new UserModel(driver);
            }, false);
        }

        public Response BlockUser(ServiceRequest request)
        {
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.UserId);
                long driverId = request.UserId.Value;

                var user = db.GetUser(driverId);
                if (user == null)
                    throw new KException("User is not found");

                user.Status = Status.Blocked;
                user.LastUpdatedTS = DateTime.Now;
            }, false);
        }

        public Response UnblockUser(ServiceRequest request)
        {
            return Run<ServiceRequest, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.UserId);
                long driverId = request.UserId.Value;

                var user = db.GetUser(driverId);
                if (user == null)
                    throw new KException("User is not found");

                user.Status = Status.Actived;
                user.LastUpdatedTS = DateTime.Now;
            }, false);
        }

        public GetUsersResponse GetBlockedUsers(ServiceRequest request)
        {
            return Run<ServiceRequest, GetUsersResponse>(request, (resp, db, session) =>
            {
                resp.Items = new System.Collections.Generic.List<UserModel>();
                var users = db.GetBlockedUsers().ToList();
                foreach (var user in users)
                    resp.Items.Add(new UserModel(user));
            }, false);
        }

        public Response RemoveUser(ServiceRequest request)
        {
            return Run<ServiceRequest, GetUsersResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.UserId);
                long driverId = request.UserId.Value;

                var user = db.GetUser(driverId);
                if (user == null)
                    throw new KException("User is not found");

                if (user.Status == Status.Inactived)
                    db.RemoveUser(user);
                else
                {
                    user.Status = Status.Deleted;
                    user.LastUpdatedTS = DateTime.Now;
                }

            }, false);
        }

        public Response RestoreUser(ServiceRequest request)
        {
            return Run<ServiceRequest, GetUsersResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.UserId);
                long driverId = request.UserId.Value;

                var user = db.GetUser(driverId);
                if (user == null)
                    throw new KException("User is not found");

                user.Status = Status.Actived;
                user.LastUpdatedTS = DateTime.Now;
            }, false);
        }
    }
}