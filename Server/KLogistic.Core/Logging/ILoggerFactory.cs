using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.Core
{
    public interface ILoggerFactory
    {
        ILogger Create(string name);
    }
}
