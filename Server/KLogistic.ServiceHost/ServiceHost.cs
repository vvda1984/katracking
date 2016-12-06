using System;
using System.Collections.Generic;
using System.ServiceProcess;

namespace KLogistic.ServiceHost
{
    public partial class ServiceHost : ServiceBase
    {
        BackendService loader = new BackendService();
        public ServiceHost()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {            
            loader.Start();
        }

        protected override void OnStop()
        {
            loader.Stop();
        }
    }
}
