using KLogistic.Data;
using System.Collections.Generic;
using System.Linq;
using System;
using KLogistic.Core;

namespace KLogistic.WebService
{
    public partial class KAService
    {       
        private JournalDriver GetJournalDriver(DataContext db, long journalId, long driverId)
        {
            return db.DBModel.JournalDrivers.FirstOrDefault(x => x.JournalId == journalId && x.UserId == driverId);
        }

        public GetJournalDriversResponse GetJournalDrivers(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalDriversResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalId = request.JournalId.Value;
                var query = db.DBModel.JournalDrivers.Where(x =>x.JournalId == journalId).ToArray();
                resp.Items = new List<JournalDriverModel>();
                if (query.Any())
                    foreach (var i in query)
                    {
                        var driver = db.DBModel.Drivers.FirstOrDefault(x => x.Id == i.UserId);
                        resp.Items.Add(new JournalDriverModel(i, driver));
                    }
                        
            }, false);
        }

        public GetJournalDriverResponse GetJournalDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalDriverResponse>(request, (resp, db, session) =>
            {
                long journalId = ValidateParamLong(request.JournalId);
                long driverId = ValidateParamLong(request.DriverId);
                var i = db.DBModel.JournalDrivers.FirstOrDefault(x => x.JournalId == journalId && x.UserId == driverId);
                if (i != null)
                {
                    var driver = db.DBModel.Drivers.FirstOrDefault(x => x.Id == i.UserId);
                    resp.Item = new JournalDriverModel(i, driver);
                }
            });
        }

        public BaseResponse UpdateJournalDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long journalId = ValidateParamLong(request.JournalId);
                long driverId = ValidateParamLong(request.DriverId);

                int? status = request.Status;
                string description = request.Description;

                var item = db.DBModel.JournalDrivers.FirstOrDefault(x => x.JournalId == journalId && x.UserId == driverId);
                if (item == null)
                    throw new KException("Not found");

                if (description != null) item.Description = description;
                if (status != null) item.Status = (JournalDriverStatus)status.Value;

                item.LastUpdatedTS = DateTime.Now;
            });
        }

        public GetJournalDriverResponse AddJournalDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalDriverResponse>(request, (resp, db, session) =>
            {
                long journalId = ValidateParamLong(request.JournalId);
                long driverId = ValidateParamLong(request.DriverId);

                int? status = request.Status;
                string description = request.Description;

                if (!db.DBModel.Journals.Any(x => x.Id == journalId && x.Status != JournalStatus.Deleted))
                    throw new KException("Journal Not found");

                var driver = db.DBModel.Drivers.FirstOrDefault(x => x.Id == driverId && x.Status != Status.Deleted);
                if (driver == null)
                    throw new KException("Driver Not found");

                JournalDriver item = db.DBModel.JournalDrivers.FirstOrDefault(x=>x.JournalId == journalId && x.UserId == driverId);
                if (item == null)
                {
                    item = new JournalDriver();
                    item.JournalId = journalId;
                    item.Description = description;
                    item.UserId = driverId;
                    item.CreatedTS = DateTime.Now;
                    item.LastUpdatedTS = DateTime.Now;
                    item.Status = JournalDriverStatus.Actived;

                    db.DBModel.JournalDrivers.Add(item);
                }
                else
                {
                    item.Description = description;
                    item.LastUpdatedTS = DateTime.Now;
                }
                db.SaveChanges();
                resp.Item = new JournalDriverModel(item, driver);
            }, false);
        }

        public BaseResponse RemoveJournalDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long journalId = ValidateParamLong(request.JournalId);
                long driverId = ValidateParamLong(request.DriverId);

                var item = db.DBModel.JournalDrivers.FirstOrDefault(x => x.JournalId == journalId && x.UserId == driverId);
                if (item == null)
                    throw new KException("Not found");

                db.DBModel.JournalDrivers.Remove(item);
            });
        }

        public BaseResponse RemoveAllJournalDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalId = request.JournalId.Value;

                var items = db.DBModel.JournalDrivers.Where(x => x.JournalId == journalId);
                foreach (var item in items)
                    db.DBModel.JournalDrivers.Remove(item);
            });
        }
    }
}