using KLogistic.Core;
using KLogistic.Data;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Data.Entity;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        private JournalStopPoint GetJournalStopPoint(DataContext db, long id)
        {
            if (id <= 0)
                throw new KException("Missing parameter 'stoppointid'");

            var item = db.DBModel.JournalStopPoints.FirstOrDefault(x => x.Id == id);
            if (item == null)
                throw new KException("JournalStopPoint is not found");

            return item;
        }        

        public GetStopPointsResponse GetJournalStopPoints(ServiceRequest request)
        {            
            return Run<ServiceRequest, GetStopPointsResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalId = request.JournalId.Value;

                resp.Items = new List<JournalStopPointModel>();
                var query = db.DBModel.JournalStopPoints.Where(x=>x.JournalId == journalId);
                foreach (var i in query)
                    resp.Items.Add(new JournalStopPointModel(i));
            });
        }

        public GetStopPointResponse GetJournalStopPoint(ServiceRequest request)
        {          
            return Run<ServiceRequest, GetStopPointResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.StopPointId);
                long stopPointId = request.StopPointId.Value;
                resp.Item = new JournalStopPointModel(GetJournalStopPoint(db, stopPointId));
            });
        }

        public BaseResponse UpdateJournalStopPoint(ServiceRequest request)
        {           
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.StopPointId);
                long stopPointId = request.StopPointId.Value;

                string name = request.Name;
                double? latitude = request.Latitude;
                double? longitude = request.Longitude;
                string extendedData = request.ExtendedData;
                string description = request.Description;

                var item = GetJournalStopPoint(db, stopPointId);

                if (name != null) item.Name = name;
                if (description != null) item.Description = description;
                if (latitude > 0) item.Latitude = latitude.Value;
                if (longitude > 0) item.Longitude = longitude.Value;
                if (extendedData != null) item.ExtendedData = extendedData;

                item.LastUpdatedTS = DateTime.Now;
            });
        }

        public GetStopPointResponse AddJournalStopPoint(ServiceRequest request)
        {           
            return Run<ServiceRequest, GetStopPointResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalId = request.JournalId.Value;

                string name = request.Name;
                double latitude = request.Latitude.Value;
                double longitude = request.Latitude.Value;
                string extendedData = request.ExtendedData;
                string description = request.Description;

                var item = new JournalStopPoint();
                item.Name = name;
                item.JournalId = journalId;
                item.Description = description;
                item.Latitude = latitude;
                item.Longitude = longitude;
                item.ExtendedData = extendedData;
                item.CreatedTS = DateTime.Now;
                item.LastUpdatedTS = DateTime.Now;

                db.DBModel.JournalStopPoints.Add(item);
            });
        }

        public BaseResponse RemoveJournalStopPoint(ServiceRequest request)
        {           
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.StopPointId);
                long stopPointId = request.StopPointId.Value;

                var item = GetJournalStopPoint(db, stopPointId);
                db.DBModel.JournalStopPoints.Remove(item);
            });
        }

        public BaseResponse RemoveAllJournalStopPoint(ServiceRequest request)
        {            
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalId = request.JournalId.Value;

                var items = db.DBModel.JournalStopPoints.Where(x => x.JournalId == journalId);
                foreach (var item in items)
                    db.DBModel.JournalStopPoints.Remove(item);
            });
        }
    }
}