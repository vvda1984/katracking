using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace KLogistic.Core
{
    public static class LogManager
    {
        public static ILogger GetLogger(string name)
        {
            var factory = DependencyResolver.Resolve<ILoggerFactory>();
            if (factory == null)
                return new LoggerWrapper(name);
            return factory.Create(name) ?? new NullLogger();
        }

        public static ILogger GetLogger<T>()
        {
            return GetLogger(typeof(T).Name);
        }
    }

    class LoggerWrapper : ILogger
    {
        string _name;
        ILogger _innerLogger;
        List<Tuple<TraceEventType, object, Exception>> _logEntries;

        public LoggerWrapper(string name)
        {
            _name = name;
            _logEntries = new List<Tuple<TraceEventType, object, Exception>>();
        }

        private ILogger TryGetInnerLogger()
        {
            if (_innerLogger == null && DependencyResolver.Current != null)
            {
                var factory = DependencyResolver.Resolve<ILoggerFactory>();
                if (factory != null)
                    _innerLogger = factory.Create(_name);
            }
            return _innerLogger;
        }

        bool ILogger.WriteCore(TraceEventType eventType, object state, Exception exception)
        {
            var innerLogger = TryGetInnerLogger();
            if (innerLogger == null)
            {
                if (_logEntries.Count < 100)
                    _logEntries.Add(Tuple.Create(eventType, state, exception));
                return true;
            }
            else
            {
                if (_logEntries != null)
                {
                    var logEntries = _logEntries.ToList();
                    _logEntries = null;
                    foreach (var logEntry in logEntries)
                        _innerLogger.WriteCore(logEntry.Item1, logEntry.Item2, logEntry.Item3);
                }

                return _innerLogger.WriteCore(eventType, state, exception);
            }
        }
    }

    public class NullLogger : ILogger
    {
        public bool WriteCore(TraceEventType eventType, object state, Exception exception)
        {
            return false;
        }
    }
}
