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
}
