using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.Core
{
    public class KException : Exception
    {
        public KException() { }
        public KException(string message) : base(message) { }
        public KException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class KSessionExpiredException : KException
    {
        public KSessionExpiredException() { }
        public KSessionExpiredException(string message) : base(message) { }
        public KSessionExpiredException(string message, Exception innerException) : base(message, innerException) { }
    }
}
