using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.ServiceHost
{
    interface IBackgroundProcess
    {
        void Start();
        void Stop();
    }
}
