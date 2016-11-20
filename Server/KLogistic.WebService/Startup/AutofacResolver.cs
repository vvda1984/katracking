using Autofac;
using KLogistic.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KLogistic
{
    class AutofacDependencyResolver : IDependencyResolver
    {
        private IComponentContext _componentContext;

        public AutofacDependencyResolver(IComponentContext componentContext)
        {
            _componentContext = componentContext;
        }

        public T Resolve<T>(string name)
        {
            if (name != null)
                return _componentContext.ResolveNamed<T>(name);

            return _componentContext.Resolve<T>();
        }
    }
}