using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.Core
{
    public static class KApplication
    {
        public static KEnvironment Environment { get; private set; } = AppSettings.Current.GetEnum("Environment", KEnvironment.Development);
        public static bool IsDevelopment
        {
            get { return Environment == KEnvironment.Development; }
        }
    }
}
