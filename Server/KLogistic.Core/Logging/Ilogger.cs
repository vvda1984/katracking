using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;

namespace KLogistic.Core
{
    public interface ILogger
    {
        bool WriteCore(TraceEventType eventType, object state, Exception exception);
    }
}
