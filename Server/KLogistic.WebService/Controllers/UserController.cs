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

        public BaseResponse UpdateUser(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.UserId);
                long driverId = request.UserId.Value;

                var user = db.GetUser(driverId);
                if (user == null)
                    throw new KException("User is not found");

                string firstName = request.FirstName;
                string lastName = request.LastName;
                string ssn = request.Ssn;
                string address = request.Address;
                string dob = request.Dob;
                string phone = request.Phone;
                string email = request.Email;
                string note = request.Note;
                int? status = request.Status;
                int? role = request.Role;

                if (firstName != null) user.FirstName = firstName;
                if (lastName != null) user.LastName = lastName;
                if (ssn != null) user.SSN = ssn;
                if (address != null) user.Address = address;
                if (dob != null) user.DOB = DateTime.ParseExact(request.Dob, "yyyy-MM-dd", null);
                if (phone != null) user.Phone = phone;
                if (email != null) user.Email = email;
                if (note != null) user.Note = note;
                if (status != null) user.Status = (Status)status.Value;
                if (role != null) user.Role = (UserRole)role.Value;
            });
        }

        public GetUserResponse AddUser(ServiceRequest request)
        {
            return Run<ServiceRequest, GetUserResponse>(request, (resp, db, session) =>
            {
                //ValidateParam(request.UserId);
                //long userId = request.UserId.Value;

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
                int? status = request.Status;
                int? role = request.Role;

                var existingUser = db.GetUser(username);
                if (existingUser != null)
                    throw new KException($"User {username} existed!");

                var user = new User();
                user.Username = username;
                user.Password = Utils.HashPassword(password);
                user.FirstName = firstName;
                user.LastName = lastName;
                user.SSN = ssn;
                user.Address = address;
                user.DOB = DateTime.ParseExact(request.Dob, "yyyy-MM-dd", null);//  request.Dob ?? request.Dob.Value;
                user.Phone = phone;
                user.Email = email;
                user.Note = note;

                user.Status = (status != null) ? (Status)status.Value : Status.Actived;
                user.Role = (role != null) ? (UserRole)role.Value : UserRole.User;

                user.LastUpdatedTS = DateTime.Now;
                user.CreatedTS = DateTime.Now;

                db.AddUser(user);

                db.SaveChanges();
                resp.Item = new UserModel(user);
            }, false);
        }

        public BaseResponse BlockUser(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
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

        public BaseResponse UnblockUser(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
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

        public BaseResponse RemoveUser(ServiceRequest request)
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

        public BaseResponse RestoreUser(ServiceRequest request)
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