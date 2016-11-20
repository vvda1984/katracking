using KLogistic;
using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            string pass = Utils.HashPassword("123");

            using (var auth = new DataContext())
            {
                auth.AddUser(new User {
                    Username = "Admin",
                    Password = Utils.HashPassword("123"),
                    Address = "Address",
                    CreatedTS = DateTime.Now,
                    DOB = new DateTime(1984, 12,29),
                    Email = "admin@gmail.com",
                    FirstName = "Admin",
                    LastName = "KA",
                    LastUpdatedTS = DateTime.Now,
                    Note ="Admin user",
                    Phone ="0123456789",
                    ResetPassword = false,
                    Role = UserRole.SuperAdmin,
                    SSN = "000000000000",
                    Status = Status.Actived,
                });

                auth.SaveChanges();
            }

          
        }
    }
}
