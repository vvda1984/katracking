using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using System.Reflection;

namespace KLogistic.Core
{
    public static class Serializer
    {
        public static string ToJson(object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static T FromJson<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }

        public static T FromJson<T>(Stream inStream)
        {
            var s = new JsonSerializer();
            using (var textreader = new StreamReader(inStream))
            using (var jsonreader = new JsonTextReader(textreader))
                return s.Deserialize<T>(jsonreader);
        }

        public static T FromJson<T>(byte[] data)
        {
            if (data == null || data.Length == 0)
                return default(T);
            return FromJson<T>(new MemoryStream(data));
        }

        public static string ToXml(object obj, string rootName = null)
        {
            var json = JsonConvert.SerializeObject(obj);
            var xmldoc = JsonConvert.DeserializeXmlNode(json, rootName);
            var sb = new StringBuilder();
            using (var xmlwriter = XmlWriter.Create(sb, new XmlWriterSettings { OmitXmlDeclaration = true }))
            {
                xmldoc.WriteTo(xmlwriter);
            }
            return sb.ToString();
        }

        public static void ToXml(object obj, Stream outStream, string rootName = null)
        {
            var json = JsonConvert.SerializeObject(obj);
            var xmldoc = JsonConvert.DeserializeXmlNode(json, rootName);
            using (var xmlwriter = XmlWriter.Create(outStream, new XmlWriterSettings { Encoding = Encoding.UTF8, OmitXmlDeclaration = true }))
            {
                xmldoc.WriteTo(xmlwriter);
            }
        }

        public static T FromXml<T>(string xml)
        {
            var t = typeof(T);
            if (t.GetCustomAttributes(true).Any())
            {
                var s = new XmlSerializer(t);
                var r = new StringReader(xml);
                return (T)s.Deserialize(r);
            }
            else
            {
                var xmlNode = new XmlDocument();
                xmlNode.LoadXml(xml);
                var json = JsonConvert.SerializeXmlNode(xmlNode, Newtonsoft.Json.Formatting.None, true);
                return FromJson<T>(json);
            }
        }

        public static T FromXml<T>(Stream inStream)
        {
            var t = typeof(T);
            if (t.GetCustomAttributes(true).Any())
            {
                var s = new XmlSerializer(t);
                var r = new StreamReader(inStream);
                return (T)s.Deserialize(r);
            }
            else
            {
                var xmlNote = new XmlDocument();
                xmlNote.Load(inStream);
                var json = JsonConvert.SerializeXmlNode(xmlNote, Newtonsoft.Json.Formatting.None, true);
                return FromJson<T>(json);
            }
        }

        public static object FromXml(Stream inStream, Type type)
        {
            var xmlNote = new XmlDocument();
            xmlNote.Load(inStream);
            var json = JsonConvert.SerializeXmlNode(xmlNote, Newtonsoft.Json.Formatting.None, true);
            return JsonConvert.DeserializeObject(json, type);
        }
    }
}
