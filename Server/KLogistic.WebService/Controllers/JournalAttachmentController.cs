using KLogistic.Data;
using System.Collections.Generic;
using System.Linq;
using System;

namespace KLogistic.WebService
{
    public partial class KAService
    {       
        private JournalAttachment GetAttachment(DataContext db, long attachmentId, string name = null, long journalId = 0)
        {
            if (attachmentId > 0)
            {
                return db.DBModel.JournalAttachments.FirstOrDefault(x => x.Id == attachmentId);
            }
            else if (journalId > 0 && name != null)
            {
                return db.DBModel.JournalAttachments.FirstOrDefault(x => x.JournalId == journalId && x.Name == name);
            }
            else
                return null;
        }

        public GetAttachmentsResponse GetAttachments(ServiceRequest request)
        {
            return Run<ServiceRequest, GetAttachmentsResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalId = request.JournalId.Value;

                var attachments = db.DBModel.Database.SqlQuery<JournalAttachmentLiteModel>(
                    @"SELECT [AttachmentId],[JournalId],[Name],[CreatedTS],[LastUpdatedTS] FROM [JournalAttachments]
                      WHERE JournalId=@p0", journalId);

                resp.Items = new List<JournalAttachmentLiteModel>();
                if (attachments.Any())
                    foreach (var att in attachments)
                        resp.Items.Add(att);
            }, false);
        }

        public GetAttachmentResponse DownloadAttachment(ServiceRequest request)
        {           
            return Run<ServiceRequest, GetAttachmentResponse>(request, (resp, db, session) =>
            {
                long journalId = request.JournalId.Value;
                long attachmentId = request.AttachmentId.Value;
                string name = request.FileName;

                var item = GetAttachment(db, attachmentId, name, journalId);
                if (item != null)
                    resp.Item = new JournalAttachmentModel(item);
            }, false);
        }

        public UploadAttachmentResponse UploadAttachment(UploadAttachmentRequest request)
        {         
            return Run<UploadAttachmentRequest, UploadAttachmentResponse>(request, (resp, db, session) =>
            {
                var item = db.DBModel.JournalAttachments.FirstOrDefault(x => x.JournalId == request.JournalId && x.Name == request.Name);
                if(item != null)
                {
                    item.DataBase64 = request.Data;
                    item.LastUpdatedTS = DateTime.Now;
                    db.SaveChanges();
                    resp.AttachmentId = item.Id;
                    resp.JournalId = item.JournalId;
                    resp.Name = item.Name;
                }
                else
                {
                    item = new JournalAttachment()
                    {
                        JournalId = request.JournalId,
                        DataBase64 = request.Data,
                        CreatedTS = DateTime.Now,
                        LastUpdatedTS = DateTime.Now,
                        Name = request.Name,
                    };
                    db.DBModel.JournalAttachments.Add(item);
                    db.SaveChanges();
                }

                resp.AttachmentId = item.Id;
                resp.JournalId = item.JournalId;
                resp.Name = item.Name;
            }, false);
        }
        
        public BaseResponse DeleteAttachment(ServiceRequest request)
        {           
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.AttachmentId);
                long attachmentId = request.AttachmentId.Value;
                var item = db.DBModel.JournalAttachments.FirstOrDefault(x => x.Id == attachmentId);
                if (item != null)
                {
                    db.DBModel.JournalAttachments.Remove(item);
                }

            }, false);
        }
    }
}