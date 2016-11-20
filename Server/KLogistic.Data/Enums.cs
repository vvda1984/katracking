using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.Data
{
    public enum Status : byte
    {
        Actived = 0,
        Blocked = 1,
        Deleted = 2,

        Inactived = 10,
    }

    public enum UserRole : byte
    {
        User = 0,
        Driver = 1,
        Customer = 2,
        Admin = 10,
        SuperAdmin = 100,
    }

    public enum SessionStatus : byte
    {
        Unspecified = 0,
        Actived = 1,
        Expired = 2,
    }

    public enum JournalStatus : byte
    {
        Initial = 0,
        Running = 2,
        Completed = 3,
        Deleted = 4,
    }

    public enum JournalDriverStatus : byte
    {
        Asigned = 0,
        Approved = 1,
        Denied = 2,
    }
}
