using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.Core
{
    public interface IDependencyResolver
    {
        T Resolve<T>(string name);
    }

    public class DependencyResolver
    {
        public static IDependencyResolver Current { get; private set; }
        public static void SetResolver(IDependencyResolver resolver)
        {
            Current = resolver;
        }

        public static T Resolve<T>() where T : class
        {
            if (Current == null)
                return null;

            return Current.Resolve<T>(null);
        }

        public static T Resolve<T>(string name) where T : class
        {
            if (Current == null)
                return null;

            return Current.Resolve<T>(name);
        }
    }
}
