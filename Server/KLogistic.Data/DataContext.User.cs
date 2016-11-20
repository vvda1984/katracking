using System.Linq;
using System.Collections.Generic;
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
            return DBModel.Drivers;
        }
     
        public IQueryable<Driver> GetBlockedDrivers()
        {
            return DBModel.Drivers.Where(x => x.Status == Status.Blocked);
        }

        public Driver GetDriver(long id)
        {
            return DBModel.Drivers.FirstOrDefault(x => x.Id == id);
        }

        public void AddDriver(Driver driver)
        {
            driver.Validate();
            DBModel.Drivers.Add(driver);
        }

        public void RemoveDriver(Driver driver)
        {
            DBModel.Drivers.Remove(driver);
        }
    }
}
