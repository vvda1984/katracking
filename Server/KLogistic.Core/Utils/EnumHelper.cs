using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace KLogistic
{
    public static class EnumHelper
    {
        public static string GetDisplayValue<TEnum>(TEnum value) where TEnum : struct
        {
            var t = typeof(TEnum);
            if (!t.IsEnum)
                throw new ArgumentException("TEnum must be an enumerated type");

            var attr = GetAttribute<DisplayAttribute>(value);

            var valueStr = Convert.ToString(value);

            if (attr == null)
                return valueStr;

            if (attr.ResourceType != null)
                return lookupResource(attr.ResourceType, attr.Name);

            return attr.Name ?? valueStr;
        }

        public static string GetShortName<TEnum>(TEnum value) where TEnum : struct
        {
            var t = typeof(TEnum);
            if (!t.IsEnum)
                throw new ArgumentException("TEnum must be an enumerated type");

            var attr = GetAttribute<DisplayAttribute>(value);
            return attr?.GetShortName();
        }

        public static int? GetOrder<TEnum>(TEnum value) where TEnum : struct
        {
            var t = typeof(TEnum);
            if (!t.IsEnum)
                throw new ArgumentException("TEnum must be an enumerated type");

            var attr = GetAttribute<DisplayAttribute>(value);
            return attr?.GetOrder();
        }

        public static TAttribute GetAttribute<TAttribute>(object value) where TAttribute : Attribute
        {
            var fieldInfo = value.GetType().GetField(value.ToString());
            if (fieldInfo == null)
                return null;
            var attrs = fieldInfo.GetCustomAttributes(true); //.GetCustomAttribute<TAttribute>(true);
            if (attrs != null && attrs.Length > 0)
                foreach (var attr in attrs)
                    if (attr is TAttribute) return (TAttribute)attr;
            return null;
        }

        private static string lookupResource(Type resourceManagerProvider, string resourceKey)
        {
            foreach (PropertyInfo staticProperty in resourceManagerProvider.GetProperties(BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public))
            {
                if (staticProperty.PropertyType == typeof(System.Resources.ResourceManager))
                {
                    System.Resources.ResourceManager resourceManager = (System.Resources.ResourceManager)staticProperty.GetValue(null, null);
                    return resourceManager.GetString(resourceKey);
                }
            }

            return resourceKey; // Fallback with the key name
        }

        public static TEnum? Parse<TEnum>(string value) where TEnum : struct
        {
            if (!typeof(TEnum).IsEnum)
            {
                throw new ArgumentException("TEnum must be an enumerated type");
            }

            TEnum result;
            if (!Enum.TryParse(value, true, out result))
                return null;

            return result;
        }

        public static IList<string> GetNames<TEnum>()
        {
            return typeof(TEnum).GetFields(BindingFlags.Static | BindingFlags.Public).Select(fi => fi.Name).ToList();
        }

        public static IList<TEnum> GetValues<TEnum>() where TEnum : struct
        {
            var type = typeof(TEnum);
            var enumValues = new List<TEnum>();

            foreach (FieldInfo fi in type.GetFields(BindingFlags.Static | BindingFlags.Public))
            {
                enumValues.Add((TEnum)Enum.Parse(type, fi.Name, false));
            }
            return enumValues;
        }
    }
}
