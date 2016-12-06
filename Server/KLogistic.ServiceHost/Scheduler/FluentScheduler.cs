using FluentScheduler;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.ServiceHost
{
    class FluentScheduler : IScheduler
    {
        public void Register()
        {
        }

        public void Start()
        {
            JobManager.Start();
        }
    }
}
