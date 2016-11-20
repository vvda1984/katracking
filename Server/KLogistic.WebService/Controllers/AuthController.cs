using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.ServiceModel.Web;

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
                resp.Token = appSession.Token;
            });
        }

        public Response Signout(Request request)
        {       
            return Run<Request, Response>(request, (res, db) => db.SignOut(request.Token));
        }

        public Response ChangePassword(ChangePasswordRequest request)
        {            
            return Run<ChangePasswordRequest, Response>(request, (resp, db, session) =>
            {
                string curpassword = request.CurrentPassword;
                string newpassword = request.CurrentPassword;

                if (string.IsNullOrEmpty(curpassword))
                    throw new KException("Current password is empty!");

                string hashOldPassword = Utils.HashPassword(curpassword);
                if (session.User.Password != hashOldPassword)
                    throw new KException("Current password does not match!");

                session.User.Password = Utils.HashPassword(newpassword);
            });
        }

        public Response Ping(Request request)
        {
            return Run<Request, Response>(request, (resp, db, session) =>
            {
                session.LastUpdatedTS = DateTime.Now;
            });
        }
    }
}