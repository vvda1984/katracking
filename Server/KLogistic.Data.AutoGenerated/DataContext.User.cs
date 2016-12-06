using System.Linq;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data;

namespace KLogistic.Data
{
    public partial class DataContext
    {
        public void AddUser(User user)
        {
            user.Validate();
            DBModel.Users.Add(user);
        }

        public User GetUser(long id)
        {
            return DBModel.Users.FirstOrDefault(x=> x.Id == id);
        }

        public void RemoveUser(User user)
        {
            DBModel.Users.Remove(user);
        }

        public IQueryable<User> GetUsers(UserRole role)
        {
            return DBModel.Users.Where(x => x.Role == role);
        }

        public IQueryable<User> GetUsers()
        {
            return DBModel.Users;
        }

        public IQueryable<User> GetBlockedUsers()
        {
            return DBModel.Users.Where(x => x.Status == Status.Blocked);
        }

        public IQueryable<Driver> GetDrivers()
        {
            //return DBModel.Drivers.Include(x => x.User).Where(x =>x.User.Status != Status.Deleted);
            return (from m in DBModel.Users.OfType<Driver>()
                    where m.Role == UserRole.Driver && m.Status != Status.Deleted
                    select m);
        }

        public IQueryable<Driver> GetBlockedDrivers()
        {
            //return DBModel.Drivers.Include(x => x.User).Where(x => x.User.Status != Status.Blocked);

            return (from m in DBModel.Users.OfType<Driver>()
                    where m.Role == UserRole.Driver && m.Status == Status.Blocked
                    select m);

            //return DBModel.Drivers.Where(x => x.Status == Status.Blocked);
        }

        public Driver GetDriver(long id)
        {
            //return DBModel.Drivers.Include(x => x.User).FirstOrDefault(x => x.User.Status != Status.Deleted);

            return (from m in DBModel.Users.OfType<Driver>()
                    where m.Role == UserRole.Driver && m.Id == id && m.Status != Status.Deleted
                    select m).FirstOrDefault();
        }

        public void AddDriver(Driver driver)
        {
            driver.Validate();
            //DBModel.Drivers.Add(driver);
            DBModel.Set<Driver>().Add(driver);
            //DBModel.Drivers.Add(driver);
        }

        public void RemoveDriver(Driver driver)
        {
            //DBModel.Drivers.Remove(driver);

            DBModel.Set<Driver>().Remove(driver);
            //DBModel.Drivers.Remove(driver);
        }
    }
}
