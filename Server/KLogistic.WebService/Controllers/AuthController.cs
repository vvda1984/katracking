using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Linq;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        public SigninResponse Signin(SigninRequest request)
        {
            return Run<SigninRequest, SigninResponse>(request, (resp, db) =>
            {
                if (request == null)
                    throw new KException("Request data error!");

                string username = request.UserName;
                string password = request.Password;

                var user = db.GetUser(username);
                if (user == null)
                    throw new KException("User doesn't exist");

                if (user.Status == Status.Blocked)
                    throw new KException("User is blocked");

                if (user.Status != Status.Actived)
                    throw new KException("User was not actived");

                if (user.Password != Utils.HashPassword(password))
                    throw new KException("Password is incorrect");

                var appSession = db.SignIn(user);
                resp.User = new UserModel(user);

                if (user.Role == UserRole.Driver)
                {
                    Driver driver = (Driver)user;
                    if (driver.Truck != null)
                        resp.Truck = new TruckModel(driver.Truck);
                }

                resp.Token = appSession.Token;
            });
        }

        public BaseResponse Signout(BaseRequest request)
        {       
            return Run<BaseRequest, BaseResponse>(request, (res, db) => db.SignOut(request.Token));
        }

        public BaseResponse ChangePassword(ChangePasswordRequest request)
        {            
            return Run<ChangePasswordRequest, BaseResponse>(request, (resp, db, session) =>
            {
                string curPassword = request.CurrentPassword;
                string newPassword = request.NewPassword;

                if (string.IsNullOrEmpty(request.UserName))
                {
                    if (string.IsNullOrEmpty(curPassword))
                        throw new KException("Current password is empty!");

                    if (string.IsNullOrEmpty(newPassword))
                        throw new KException("New password is empty!");
                
                    string hashCurrentPassword = Utils.HashPassword(curPassword);
                    if (session.User.Password != hashCurrentPassword)
                        throw new KException("Current password does not match!");

                    session.User.Password = Utils.HashPassword(newPassword);
                    session.User.LastUpdatedTS = DateTime.Now;
                }
                else
                {
                    var user = db.DBModel.Users.FirstOrDefault(x => string.Compare(x.Username, request.UserName, StringComparison.OrdinalIgnoreCase) == 0);
                    if(user == null)
                        throw new KException("User doesn't exist!");

                    if (string.IsNullOrEmpty(newPassword))
                        throw new KException("New password is empty!");

                    session.User.Password = Utils.HashPassword(newPassword);
                    session.User.LastUpdatedTS = DateTime.Now;
                }                
            });
        }

        public BaseResponse Ping(BaseRequest request)
        {
            return Run<BaseRequest, BaseResponse>(request, (resp, db, session) =>
            {
                session.LastUpdatedTS = DateTime.Now;
            });
        }
    }
}