using System.Configuration;

namespace KLogistic
{
    public class AppSettings
    {
        public static readonly AppSettings Current = new AppSettings();
        //public static AppSettings GetProcessSettings(string name) { return new AppSettings(name); }

        //private string _prefix = "";
        //internal AppSettings(string name = "")
        //{
        //    _prefix = name;
        //}

        private AppSettingsReader _appSettingsReader;

        public string GetString(string name, string defaultValue = null)
        {
            var key = name; // $"{_prefix}:{name}";
            if (_appSettingsReader == null)
                _appSettingsReader = new AppSettingsReader();
            try
            {
                return Utils.StringDefault((string)_appSettingsReader.GetValue(key, typeof(string)), defaultValue);
            }
            catch
            {
                return defaultValue;
            }
        }

        public long GetNumber(string name, long defaultValue = 0)
        {
            var value = GetString(name);
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            long n;
            if (!long.TryParse(value, out n))
                return defaultValue;

            return n;
        }

        public double GetDouble(string name, double defaultValue = 0)
        {
            var value = GetString(name);
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            double n;
            if (!double.TryParse(value, out n))
                return defaultValue;

            return n;
        }

        public TEnum GetEnum<TEnum>(string settingName, TEnum defaultValue) where TEnum : struct
        {
            return EnumHelper.Parse<TEnum>(GetString(settingName)) ?? defaultValue;
        }
    }
}
