using KLogistic.Core;
using System;
using System.Linq;

namespace KLogistic.Data
{
    public partial class DataContext : IDisposable
    {
        private KdbModel _dbContext;
        public KdbModel DBModel
        {
            get
            {
                if (_dbContext == null)
                    _dbContext = new KdbModel();
                return _dbContext;
            }
        }

        public bool IsReadonly { get; private set; }

        public DataContext(bool isReadonly = false)
        {
            IsReadonly = isReadonly;
        }

        public void Dispose()
        {
            if (_dbContext != null)
            {
                _dbContext.Dispose();
                _dbContext = null;
            }
        }

        public int SaveChanges()
        {
            if (IsReadonly)
                throw new Core.KException("Database is in Read Only mode");

            if (_dbContext != null)
                return _dbContext.SaveChanges();
            return 0;
        }

        internal bool Exists<T>(T entity) where T : class
        {
            return DBModel.Set<T>().Local.Any(e => e == entity);
        }
    }

    public partial class Truck
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(TruckName))
                throw new KException("Truck Name is empty");

            if (TruckName.Length < 3)
                throw new KException("Truck name is too short");

            if (string.IsNullOrWhiteSpace(TruckNumber))
                throw new KException("Truck Number is empty");
        }
    }

    public partial class User
    {
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(Username))
                throw new KException("User name is empty");

            if (Username.Length < 3)
                throw new KException("User name is too short");

            if (string.IsNullOrWhiteSpace(Password))
                throw new KException("Password is empty");
        }
    }
}
