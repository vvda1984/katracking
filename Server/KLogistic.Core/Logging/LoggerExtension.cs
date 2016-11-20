using System;
using System.Diagnostics;

namespace KLogistic.Core
{
    public static class LoggerExtensions
    {
        public static void WriteCritical(this ILogger logger, string message, Exception error = null)
        {
            logger.WriteCore(TraceEventType.Critical, message, error);
        }

        public static void WriteError(this ILogger logger, string message, Exception error = null)
        {
            logger.WriteCore(TraceEventType.Error, message, error);
        }

        public static void WriteWarning(this ILogger logger, string message, Exception error = null)
        {
            logger.WriteCore(TraceEventType.Warning, message, error);
        }

        public static void WriteInfo(this ILogger logger, string message)
        {
            logger.WriteCore(TraceEventType.Information, message, null);
        }

        public static void WriteVerbose(this ILogger logger, string message)
        {
            logger.WriteCore(TraceEventType.Verbose, message, null);
        }

        public static ILogger Create<T>(this ILoggerFactory factory)
        {
            return factory.Create(typeof(T).Name);
        }
    }
}
