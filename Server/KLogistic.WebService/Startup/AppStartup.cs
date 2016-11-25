using Autofac;
using KLogistic.Core;
using KLogistic.WebService;
using System;

namespace KLogistic
{
    public class AppStartup
    {
        public static bool SetupCompleted { get; private set; }
        private static readonly object syncLock = new object();

        public static void Setup()
        {
            if (SetupCompleted)
                return;

            lock (syncLock)
            {
                if (SetupCompleted)
                    return;

                try
                {
                    var cb = new ContainerBuilder();

                    cb.Register(c => new LoggerFactory()).As<ILoggerFactory>().SingleInstance();
                    BaseResponse.RegisterResponses(cb);

                    var container = cb.Build();

                    DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

                    SetupCompleted = true;
                }
                catch (Exception ex)
                {
                    LogManager.GetLogger<AppStartup>().WriteCritical($"Cannot start application: {ex.Message}", ex);
                }
            }
        }
    }
}