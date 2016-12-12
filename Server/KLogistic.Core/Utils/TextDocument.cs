using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace KLogistic.Core
{
    public class TextDocument
    {
        private string _text;

        public void Load(string content)
        {
            _text = content;
        }

        public void Load(byte[] content)
        {
            if (content == null || content.Length == 0)
            {
                _text = "";
            }
            else
            {
                using (var streamReader = new StreamReader(new MemoryStream(content)))
                    _text = streamReader.ReadToEnd();
            }
        }

        public void Load(Stream contentStream)
        {
            using (var streamReader = new StreamReader(contentStream))
            {
                _text = streamReader.ReadToEnd();
            }
        }

        public void Replace(IDictionary<string, string> replacements)
        {
            if (_text == null)
                throw new InvalidOperationException("Document has not loaded yet.");
            if (_text.Length == 0)
                return;

            var sr = new StringReader(_text);
            var sb = new StringBuilder();
            string textLine = null;
            string varName = null;
            int lineIndex = -1;
            int colIndex = -1;
            while ((textLine = sr.ReadLine()) != null)
            {
                lineIndex++;
                if (lineIndex > 0)
                    sb.AppendLine();

                for (colIndex = 0; colIndex < textLine.Length; colIndex++)
                {
                    var c = textLine[colIndex];
                    if (c == '{')
                    {
                        if (varName == null)
                        {
                            varName = "";
                        }
                        else if (varName == "") // { at prev char
                        {
                            sb.Append('{');
                            varName = null;
                        }
                        else
                        {
                            throw new FormatException(string.Format("Invalid text template. Error at line {0} column {1}.", lineIndex + 1, colIndex + 1));
                        }
                    }
                    else if (c == '}')
                    {
                        if (varName == null)
                        {
                            sb.Append('}');
                        }
                        else if (varName == "")
                        {
                            throw new FormatException(string.Format("Invalid text template. Error at line {0} column {1}.", lineIndex + 1, colIndex + 1));
                        }
                        else
                        {
                            if (replacements.ContainsKey(varName))
                                sb.Append(replacements[varName]);
                            varName = null;
                        }
                    }
                    else if (varName != null)
                    {
                        varName += c;
                    }
                    else
                    {
                        sb.Append(c);
                    }
                }
            }

            if (varName != null)
                throw new FormatException(string.Format("Invalid text template. Error at line {0} column {1}.", lineIndex + 1, colIndex + 1));

            _text = sb.ToString();
        }

        public override string ToString()
        {
            return _text ?? "";
        }
    }
}
