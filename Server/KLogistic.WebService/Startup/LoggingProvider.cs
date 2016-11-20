using KLogistic.Core;
using NLog;
using NLog.Config;
using NLog.Targets;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;

namespace KLogistic
{
    public class LoggerFactory : ILoggerFactory
    {
        public NLog.LogFactory NLogFactory { get; private set; }

        public LoggerFactory()
        {
            this.NLogFactory = new NLog.LogFactory();
        }

        public Core.ILogger Create(string name)
        {
            return new Logger(this, name);
        }
    }

    class Logger : Core.ILogger
    {
        private LoggerFactory _factory;
        private NLog.Logger _nlogLogger;
        private string _name;

        public Logger(LoggerFactory factory, string name)
        {
            _factory = factory;
            _name = name;
        }

        public bool WriteCore(TraceEventType eventType, object state, Exception exception)
        {
            try {
                var logLevel = ToLogLevel(eventType);
                if (state != null || exception != null)
                {
                    string message;
                    if (state == null)
                        message = exception.Message;
                    else
                        message = Convert.ToString(state);

                    var logEvent = new LogEventInfo
                    {
                        Level = logLevel,
                        Exception = exception,
                        Message = message,
                    };

                    string error = exception != null ? exception.GetFullMessage() : "";
                    logEvent.LoggerName = _name;
                    File.AppendAllText(@"C:\AnVo-tmp\log\kawebapis\log.txt",
                        $"{DateTime.Now.ToString()} | {logLevel.ToString().Substring(0, 4)} | {message} | {error}{Environment.NewLine}");
                }
            }
            catch {
                return false;
            }
           
            return true;

            //if (_nlogLogger == null)
            //    _nlogLogger = _factory.NLogFactory.GetLogger(_name);

            //var logLevel = ToLogLevel(eventType);
            //if (!_nlogLogger.IsEnabled(logLevel))
            //    return false;

            //if (state != null || exception != null)
            //{
            //    string message;
            //    if (state == null)
            //        message = exception.Message;
            //    else
            //        message = Convert.ToString(state);

            //    var logEvent = new LogEventInfo
            //    {
            //        Level = logLevel,
            //        Exception = exception,
            //        Message = message,
            //    };


            //    logEvent.LoggerName = _name;
            //    _nlogLogger.Log(logEvent);
            //}
            //return true;
        }

        private static NLog.LogLevel ToLogLevel(TraceEventType eventType)
        {
            switch (eventType)
            {
                case TraceEventType.Error:
                    return NLog.LogLevel.Error;
                case TraceEventType.Warning:
                    return NLog.LogLevel.Warn;
                case TraceEventType.Information:
                    return NLog.LogLevel.Info;
                case TraceEventType.Verbose:
                    return NLog.LogLevel.Trace;
                case TraceEventType.Critical:
                    return NLog.LogLevel.Fatal;
                case TraceEventType.Resume:
                case TraceEventType.Start:
                case TraceEventType.Stop:
                case TraceEventType.Suspend:
                    return NLog.LogLevel.Debug;
                default:
                    return NLog.LogLevel.Off;
            }
        }
    }

}