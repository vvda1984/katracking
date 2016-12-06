using Autofac;
using KLogistic;
using KLogistic.Core;
using System;
using System.Collections.Generic;

namespace KLogistic.ServiceHost
{
    public class BackendService
    {
        List<IBackgroundProcess> _process = new List<IBackgroundProcess>();

        public void Start()
        {
            PrepareEnvironment();

            _process = new List<IBackgroundProcess>();
            _process.Add(new ReportService());
            foreach (var service in _process)
                service.Start();
        }

        public void Stop()
        {
            foreach (var service in _process)
                service.Stop();
        }

        private void PrepareEnvironment()
        {
            try
            {
                var cb = new ContainerBuilder();

                cb.Register(c => new LoggerFactory()).As<ILoggerFactory>().SingleInstance();
                var container = cb.Build();

                //DependencyResolver.SetResolver(new AutofacDependencyResolver(container);
            }
            catch (Exception ex)
            {
                LogManager.GetLogger<AppStartup>().WriteCritical($"Cannot start application: {ex.Message}", ex);
            }
        }
    }
}
