using System.Configuration;


namespace KLogistic
{
    public class AppSettings
    {
        public static readonly AppSettings Current = new AppSettings();

        private AppSettingsReader _appSettingsReader;

        public string GetString(string name, string defaultValue = null)
        {
            var key = "App:" + name;
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

        public int GetInt(string name, int defaultValue = 0)
        {
            var value = GetString(name);
            if (string.IsNullOrWhiteSpace(value))
                return defaultValue;

            int n;
            if (!int.TryParse(value, out n))
                return defaultValue;

            return n;
        }

        public TEnum GetEnum<TEnum>(string settingName, TEnum defaultValue) where TEnum : struct
        {
            return EnumHelper.Parse<TEnum>(GetString(settingName)) ?? defaultValue;
        }
    }
}
