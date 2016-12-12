using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.Linq;
using System.Text;

namespace KLogistic.Core
{
    public class NameValueSettings : NameValueCollection
    {
        public NameValueSettings()
        {
        }

        public NameValueSettings(string text)
        {
            if (!string.IsNullOrEmpty(text))
            {
                var parts = text.Split(";".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    string name, value;
                    ParseValue(part, out name, out value);
                    if (!string.IsNullOrWhiteSpace(name))
                        Add(name, value);
                }
            }
        }

        private void ParseValue(string text, out string name, out string value)
        {
            name = "";
            StringBuilder sb = new StringBuilder();
            foreach (var c in text)
                if (c.Equals('='))
                {
                    name = sb.ToString().Trim();
                    sb.Clear();
                }
                else
                    sb.Append(c);
            value = sb.ToString().Trim();
        }

        public T Get<T>(string name, T defaultValue)
        {
            var t = typeof(T);

            try
            {
                var value = this[name];
                if (t == typeof(string))
                    return (T)(object)value;

                if (t == typeof(TimeSpan))
                {
                    if (string.IsNullOrEmpty(value))
                        return defaultValue;
                    return (T)(object)TimeSpan.Parse(value, CultureInfo.InvariantCulture);
                }

                return (T)Convert.ChangeType(value, t);
            }
            catch
            {
                return defaultValue;
            }
        }
    }
}
