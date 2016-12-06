using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;

namespace KLogistic.ServiceHost
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            bool runAsConsole = false;
            if (args != null && args.Length > 0)
                runAsConsole = args.Any(a =>
                          string.Compare(a, "console", StringComparison.OrdinalIgnoreCase) == 0 ||
                          string.Compare(a, "-console", StringComparison.OrdinalIgnoreCase) == 0 ||
                          string.Compare(a, "c", StringComparison.OrdinalIgnoreCase) == 0 ||
                          string.Compare(a, "-c", StringComparison.OrdinalIgnoreCase) == 0
                      );

            if (runAsConsole)
            {
                // Console mode
                var backendService = new BackendService();
                try
                {
                    Console.WriteLine("Service is starting...");
                    backendService.Start();
                    Console.WriteLine("Service has been started successfully. Press any key to exit...");

                    Console.ReadKey(true);
                    backendService.Stop();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error:\n{0}", ex);
                    Console.ReadKey(true);
                }
            }
            else
            {
                ServiceBase[] ServicesToRun;
                ServicesToRun = new ServiceBase[]
                {
                    new ServiceHost()
                };
                ServiceBase.Run(ServicesToRun);
            }
        }
    }
}
