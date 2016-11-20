using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;

namespace KLogistic
{
    public static partial class Utils
    {
        public static long? ParseInt64(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;
            long n;
            if (!long.TryParse(value, out n))
                return null;
            return n;
        }

        public static bool? ParseBool(string value)
        {
            bool? valueBool = null;
            if (!string.IsNullOrWhiteSpace(value))
            {
                value = value.Trim().ToLower();
                if (value == "true" || value == "1" || value == "yes")
                    valueBool = true;
                else if (value == "false" || value == "0" || value == "no")
                    valueBool = false;
            }
            return valueBool;
        }

        public static DateTime? ParseDateTime(string value, string format = null)
        {
            if (value == null)
                return null;

            DateTime datetime = DateTime.MinValue;

            if (format != null)
            {
                if (DateTime.TryParseExact(value, format, CultureInfo.InvariantCulture.DateTimeFormat, DateTimeStyles.None, out datetime))
                    return datetime;
            }

            if (value.EndsWith("Z", StringComparison.OrdinalIgnoreCase)) // ISO 8601
            {
                try
                {
                    return DateTime.Parse(value, null, DateTimeStyles.RoundtripKind);
                }
                catch
                {
                }
            }

            if (value.Length == 8)
            {
                if (DateTime.TryParseExact(value, "yyyyMMdd", CultureInfo.InvariantCulture.DateTimeFormat, DateTimeStyles.None, out datetime))
                    return datetime;
            }

            if (value.Length == 14)
            {
                if (DateTime.TryParseExact(value, "yyyyMMddHHmmss", CultureInfo.InvariantCulture.DateTimeFormat, DateTimeStyles.None, out datetime))
                    return datetime;
            }

            return null;
        }

        public static decimal? ParseDecimal(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;
            decimal n;
            if (!decimal.TryParse(value, out n))
                return null;
            return n;
        }

        public static string StringFormat(string format, params object[] args)
        {
            try
            {
                return string.Format(format, args);
            }
            catch
            {
                return format;
            }
        }

        public static string StringTruncate(string str, int length)
        {
            if (str == null || str.Length <= length)
                return str;
            return str.Substring(0, length);
        }

        public static string StringDefault(string str, string defaultIfNullOrEmpty)
        {
            return string.IsNullOrEmpty(str) ? defaultIfNullOrEmpty : str;
        }

        public static string GetFullMessage(this Exception ex)
        {
            var errors = new List<string>();
            while (ex != null)
            {
                errors.Add(ex.Message);
                ex = ex.InnerException;
            }
            return string.Join("\r\n", errors);
        }

        public static bool CompareCollections<T>(IEnumerable<T> arr1, IEnumerable<T> arr2)
        {
            if (arr1 == null && arr2 == null)
                return true;
            if (arr1 == null || arr2 == null)
                return false;
            return arr1.SequenceEqual(arr2);
        }
    }
}
