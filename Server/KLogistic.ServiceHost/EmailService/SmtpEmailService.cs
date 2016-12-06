using KLogistic.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;

namespace KLogistic.ServiceHost
{
    public class SmtpEmailService
    {
        public static TimeSpan? SendTimeout { get; set; } = TimeSpan.FromSeconds(100);

        public void SendMail(MailMessage message)
        {
            if (message.To == null || message.To.Count == 0)
                throw new Exception("Require email receipient.");
           
            using (var client = new SmtpClient())
            {
                if (SendTimeout != null)
                    client.Timeout = (int)SendTimeout.Value.TotalMilliseconds;

                if (message.From == null)
                {
                    var credentials = client.Credentials.GetCredential(client.Host, client.Port, "");
                    message.From = new MailAddress(credentials.UserName, "No-Reply Auto Report");
                }

                client.Send(message);                
            }
        }

        public void SendMail(string address, EmailTemplate template, Dictionary<string, string> replace, List<Tuple<string, Stream>> attachments)
        {
            var bodyDocument = new TextDocument();
            bodyDocument.Load(template.Body);
            bodyDocument.Replace(replace);
            var body = bodyDocument.ToString();

            var subjectDocument = new TextDocument();
            subjectDocument.Load(template.Subject);
            subjectDocument.Replace(replace);
            var subject = subjectDocument.ToString();

            var mesage = new MailMessage
            {
                Body = body,
                Subject = subject,
                IsBodyHtml = true,
                Priority = MailPriority.Normal,
                DeliveryNotificationOptions =
                    DeliveryNotificationOptions.Delay |
                    DeliveryNotificationOptions.OnFailure |
                    DeliveryNotificationOptions.OnSuccess,
            };
            mesage.To.Add(address);

            if (attachments != null && attachments.Count > 0)
                foreach (var attachment in attachments)
                    mesage.Attachments.Add(new Attachment(attachment.Item2, attachment.Item1));

            SendMail(mesage);
        }        
    }
}
