using System;
using System.Linq;
using System.Data.Entity;
using KLogistic.Core;

namespace KLogistic.Data
{
    public partial class DataContext
    {
        public User GetUser(string userName)
        {
            return DBModel.Users.FirstOrDefault(x=> x.Username == userName);
        }

        public AppSession ValidateToken(string token)
        {
            var session = DBModel.AppSessions.Include(x=>x.User).FirstOrDefault(x => x.Token == token && x.Status == SessionStatus.Actived);
            if (session != null)
            {
                var now = DateTime.Now;
                if (session.LastUpdatedTS.Subtract(now).TotalMinutes > 60)
                    throw new KSessionExpiredException("Session is expired!");

                session.LastUpdatedTS = now;
                return session;
            }
            else
                throw new KException("Session is not found!");
        }

        public AppSession SignIn(User user)
        {
            AppSession session = null;

            var currentSession = DBModel.AppSessions.FirstOrDefault(x => x.UserId == user.Id);
            if (currentSession != null)
                currentSession.Status = SessionStatus.Expired;

            session = new AppSession
            {
                User = user,
                Token = Guid.NewGuid().ToString("N"),
                CreatedTS = DateTime.Now,
                LastUpdatedTS = DateTime.Now,
                Status = SessionStatus.Actived
            };
            DBModel.AppSessions.Add(session);
            DBModel.SaveChanges();

            return session;
        }

        public AppSession SignOut(string token)
        {
            AppSession session = null;

            var currentSession = DBModel.AppSessions.FirstOrDefault(x => x.Token == token);
            if (currentSession != null)
                currentSession.Status = SessionStatus.Expired;
            DBModel.SaveChanges();

            return session;
        }
    }
}
