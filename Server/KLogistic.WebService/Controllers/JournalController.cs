using KLogistic.Core;
using KLogistic.Data;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Data.Entity;
using System.Collections.Concurrent;

namespace KLogistic.WebService
{
    public partial class KAService
    {        
        ConcurrentDictionary<long, JournalLocation> _caches = new ConcurrentDictionary<long, JournalLocation>();

        private Journal GetJournal(DataContext db, long journalid)
        {
            if (journalid <= 0)
                throw new KException("Missing parameter 'journalid'");

            var journal = db.DBModel.Journals
                .Include(x=>x.JournalActivities)
                .Include(x => x.JournalStopPoints)                
                .FirstOrDefault(x => x.Id == journalid);
            if (journal == null)
                throw new KException("Journal is not found");

            return journal;
        }
                    
        private JournalLocation AddJournalLocation(DataContext db, JournalLocation lastLocation, SyncLocationModel model, DateTime date)
        {
            bool addNewLocation = true;
            if (lastLocation == null)
            {
                var journal = db.DBModel.Journals.Include(x => x.JournalLocations).FirstOrDefault(x => x.Id == model.JournalId);
                lastLocation = journal.JournalLocations.Count() > 0 ? journal.JournalLocations.LastOrDefault() : null;
                if (lastLocation != null)
                {
                    var distance = Geolocation.CalcDistance(model.Latitude, model.Longitude, lastLocation.Latitude, lastLocation.Longitude);
                    if (distance < Constants.AcceptedDistance)
                    {
                        lastLocation.StopCount += model.StopCount;
                        lastLocation.LastUpdatedTS = date;
                        if (!string.IsNullOrEmpty(model.Address))
                            lastLocation.Address = model.Address;
                        addNewLocation = false;
                    }
                }
            }

            if (addNewLocation)
            {
                JournalLocation location = new JournalLocation
                {
                    Accuracy = model.Accuracy,
                    Latitude = model.Latitude,
                    Longitude = model.Longitude,
                    CreatedTS = date,
                    LastUpdatedTS = date,
                    UserId = model.DriverId,
                    JournalId = model.JournalId,
                    TruckId = model.TruckId,
                    StopCount = model.StopCount,
                    Address = model.Address,
                };
                db.DBModel.JournalLocations.Add(location);
                lastLocation = location;
            }
            return lastLocation;
        }

        private void AddJournalActivity(DataContext db, long activityId, string activityMessage, DateTime date, long journalId, long driverId, long truckId)
        {
            db.DBModel.JournalActivities.Add(new JournalActivity
            {
                ActivityId = activityId,
                ActivityDetail = activityMessage,
                CreatedTS = date,
                LastUpdatedTS = date,
                UserId = driverId,
                JournalId = journalId,
            });

            if (activityId == Constants.Action_KetThucHanhTrinh)
            {               
                var journal = db.DBModel.Journals.FirstOrDefault(x => x.Id == journalId);
                if (journal == null)
                    throw new KException("Server internal error: journal not found");

                journal.Status = JournalStatus.Completed;
                var driver = journal.JournalDrivers.FirstOrDefault(x => x.UserId == driverId);
                if (driver == null)
                    throw new KException("Server internal error: driver not found");

                driver.Status = JournalDriverStatus.Completed;
                var truck = db.DBModel.Trucks.FirstOrDefault(x => x.Id == truckId);
                if (truck == null)
                    throw new KException("Server internal error: truck not found");
                truck.Status = TruckStatus.Actived;
            }
            else if (activityId == Constants.Action_BatDauHanhTrinh)
            {
                var journal = db.DBModel.Journals.FirstOrDefault(x => x.Id == journalId);
                if (journal == null)
                    throw new KException("Server internal error: journal not found");
                journal.Status = JournalStatus.Started;

                var driver = journal.JournalDrivers.FirstOrDefault(x => x.UserId == driverId);
                if (driver == null)
                    throw new KException("Server internal error: driver not found");
                driver.Status = JournalDriverStatus.Started;

                var truck = db.DBModel.Trucks.FirstOrDefault(x => x.Id == truckId);
                if (truck == null)
                    throw new KException("Server internal error: truck not found");
                truck.Status = TruckStatus.Working;
            }
            else if (activityId == Constants.Action_ThoatHanhTrinh)
            {               
                var journal = db.DBModel.Journals.FirstOrDefault(x => x.Id == journalId);
                if (journal == null)
                    throw new KException("Server internal error: journal not found");
                journal.Status = JournalStatus.Actived;

                var driver = journal.JournalDrivers.FirstOrDefault(x => x.UserId == driverId);
                if (driver == null)
                    throw new KException("Server internal error: driver not found");
                driver.Status = JournalDriverStatus.Actived;

                var truck = db.DBModel.Trucks.FirstOrDefault(x => x.Id == truckId);
                if (truck == null)
                    throw new KException("Server internal error: truck not found");
                truck.Status = TruckStatus.Actived;
            }
        }

        private JournalModel CreateJournalModel(DataContext db, Journal journal, bool includeActivity = false, bool includeAttachment = false, bool includeStopPoint = false, bool includeDriver = false)
        {
            var item = new JournalModel(journal);
            if (includeActivity)
                foreach (var i in journal.JournalActivities)
                    item.Activities.Add(new JournalActivityModel(i));

            if (includeAttachment)
                foreach (var i in journal.JournalAttachments)
                    item.Attachments.Add(new JournalAttachmentModel(i));

            if (includeStopPoint)
                foreach (var i in journal.JournalStopPoints)
                    item.StopPoints.Add(new JournalStopPointModel(i));

            if (includeDriver)
                foreach (var i in journal.JournalDrivers)
                {
                    var driver = db.GetDriver(i.UserId);
                    item.Drivers.Add(new JournalDriverModel(i, driver));
                }

            return item;
        }

        public GetJournalsResponse GetJournals(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalsResponse>(request, (resp, db, session) =>
            {
                var status = request.Status;
                var includeActivity = request.IncludeActivity == null ? false : request.IncludeActivity.Value;
                var includeAttachment = request.IncludeAttachment == null ? false : request.IncludeAttachment.Value;
                var includeStopPoint = request.IncludeStopPoint == null ? false : request.IncludeStopPoint.Value;
                var includeDriver = request.IncludeDriver == null ? false : request.IncludeDriver.Value;


                resp.Items = new List<JournalModel>();
                var query = (status == null) ? 
                        db.DBModel.Journals.Where(x => x.Status != JournalStatus.Deleted) :
                        db.DBModel.Journals.Where(x => x.Status == (JournalStatus)status);
                var array = query.ToArray();
                foreach (var journal in query)
                    resp.Items.Add(CreateJournalModel(db, journal, includeActivity, includeAttachment, includeStopPoint, includeDriver));
            });
        }

        public GetJournalResponse GetJournal(ServiceRequest request)
        {          
            return Run<ServiceRequest, GetJournalResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;

                var includeActivity = request.IncludeActivity == null ? false : request.IncludeActivity.Value;
                var includeAttachment = request.IncludeAttachment == null ? false : request.IncludeAttachment.Value;
                var includeStopPoint = request.IncludeStopPoint == null ? false : request.IncludeStopPoint.Value;
                var includeDriver = request.IncludeDriver == null ? false : request.IncludeDriver.Value;


                var journal = GetJournal(db, journalid);
                resp.item = CreateJournalModel(db, journal, includeActivity, includeAttachment, includeStopPoint, includeDriver);
        });
        }

        public GetJournalHistoryResponse GetJournalByName(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalHistoryResponse>(request, (resp, db) =>
            {                
                string name = request.Name;

                var journal = db.DBModel.Journals
                   .Include(x => x.JournalActivities)
                   .Include(x => x.JournalStopPoints)
                   .Include(x => x.JournalLocations)
                   .FirstOrDefault(x => string.Compare(x.Name, name, StringComparison.OrdinalIgnoreCase) == 0);

                if (journal == null)
                    throw new KException("Journal not found");
                resp.Item = new JournalHistoryModel(journal, false);
            }, true);
        }

        public BaseResponse UpdateJournal(ServiceRequest request)
        {       
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);                
                var journal = GetJournal(db, request.JournalId.Value);

                if (request.Name != null) journal.Name = request.Name;
                if (request.Description != null) journal.Description = request.Description;
                if (request.StartLocation != null) journal.StartLocation = request.StartLocation;
                if (request.StartLat != null) journal.StartLat = request.StartLat.Value;
                if (request.StartLng > 0) journal.StartLng = request.StartLng.Value;
                if (request.EndLocation != null) journal.EndLocation = request.EndLocation;
                if (request.EndLat > 0) journal.EndLat = request.EndLat.Value;
                if (request.EndLng > 0) journal.EndLng = request.EndLng.Value;
                if (request.ActiveDate != null) journal.ActiveDate = DateTime.ParseExact(request.ActiveDate, "yyyy-MM-dd", null);
                if (request.Status != null) journal.Status = (JournalStatus)request.Status.Value;
                if (request.ExtendedData != null) journal.ExtendedData = request.ExtendedData;                
                if (request.ReferenceCode != null) journal.ReferenceCode = request.ReferenceCode;
                if (request.EstimatedDuration != null) journal.EstimatedDuration = request.EstimatedDuration;
                if (request.EstimatedDistance != null) journal.EstimatedDistance = request.EstimatedDistance;
                if (request.Mooc != null) journal.Mooc = request.Mooc;
                if (request.Container != null) journal.Container = request.Container;
                if (request.RouteId != null) journal.RouteId = request.RouteId.Value;

                journal.LastUpdatedTS = DateTime.Now;
            });
        }

        public GetJournalResponse AddJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalResponse>(request, (resp, db, session) =>
            {                              
                var journal = new Journal();
                journal.Name = request.Name;
                journal.Description = request.Description;
                journal.StartLocation = request.StartLocation;
                journal.StartLat = request.StartLat ?? 0;
                journal.StartLng = request.StartLng ?? 0;
                journal.EndLocation = request.EndLocation;
                journal.EndLat = request.EndLat ?? 0;
                journal.EndLng = request.EndLng ?? 0;
                journal.ActiveDate = request.ActiveDate != null ? DateTime.ParseExact(request.ActiveDate, "yyyy-MM-dd", null) : DateTime.Now;
                journal.ExtendedData = request.ExtendedData;
                journal.Status = (JournalStatus)(request.Status ?? 0);
                journal.CreatedTS = DateTime.Now;
                journal.LastUpdatedTS = DateTime.Now;                
                journal.ReferenceCode = request.ReferenceCode;
                journal.EstimatedDuration = request.EstimatedDuration;
                journal.EstimatedDistance = request.EstimatedDistance;                
                journal.Mooc = request.Mooc;
                journal.Container = request.Container;
                journal.RouteId = request.RouteId;

                journal.Validate();

                db.DBModel.Journals.Add(journal);
                db.SaveChanges();

                resp.item = new JournalModel(journal);
            }, false);
        }

        public BaseResponse RemoveJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;

                var journal = GetJournal(db, journalid);
                if (journal.Status == JournalStatus.Actived)
                {
                    var stopPoints = journal.JournalStopPoints.ToArray();
                    journal.JournalStopPoints.Clear();
                    foreach (var i in stopPoints)
                        db.DBModel.JournalStopPoints.Remove(i);

                    var activities = journal.JournalActivities.ToArray();
                    journal.JournalActivities.Clear();
                    foreach (var i in activities)
                        db.DBModel.JournalActivities.Remove(i);

                    var journalAttachments = journal.JournalAttachments.ToArray();
                    journal.JournalAttachments.Clear();
                    foreach (var i in journalAttachments)
                        db.DBModel.JournalAttachments.Remove(i);

                    var journalDrivers = journal.JournalDrivers.ToArray();
                    journal.JournalDrivers.Clear();
                    foreach (var i in journalDrivers)
                        db.DBModel.JournalDrivers.Remove(i);

                    var locations = journal.JournalLocations.ToArray();
                    journal.JournalLocations.Clear();
                    foreach (var i in locations)
                        db.DBModel.JournalLocations.Remove(i);

                    db.DBModel.Journals.Remove(journal);
                }
                else
                {
                    journal.Status = JournalStatus.Deleted;
                    journal.LastUpdatedTS = DateTime.Now;
                }
            });
        }

        public GetJourneyResponse GetJourney(ServiceRequest request)    
        {
            return Run<ServiceRequest, GetJourneyResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;
                ValidateParam(request.DriverId);
                long driverid = request.DriverId.Value;

                var locations = db.DBModel.JournalLocations.Include(x=>x.User).Where(x=>x.UserId == driverid && x.JournalId == journalid).ToList();
                if (locations.Any())
                {
                    resp.Item = new JourneyModel();
                    resp.Item.Locations = new List<JournalLocationModel>();
                    resp.Item.Driver = new UserModel(locations[0].User);
                    foreach (var i in locations)
                        resp.Item.Locations.Add(new JournalLocationModel(i));
                }
            });
        }

        public BaseResponse AddJournalLocation(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJourneyResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalId = request.JournalId.Value;

                ValidateParam(request.DriverId);
                long driverId = request.DriverId.Value;

                ValidateParam(request.TruckId);
                long truckId = request.TruckId.Value;

                double lat = request.Latitude.Value;
                double lng = request.Longitude.Value;
                double acc = request.Accuracy.Value;
                
                var date = request.CreatedTS != null ? DateTime.ParseExact(request.CreatedTS, "yyyy-MM-dd HH:mm:ss", null) : DateTime.Now;
                AddJournalLocation(
                    db,
                    null,
                    new SyncLocationModel
                    {
                        DriverId = driverId,
                        TruckId = truckId,
                        JournalId = journalId,
                        Accuracy = acc,
                        Latitude = lat,
                        Longitude = lng,
                        Address = request.Address,
                        StopCount = request.StopCount != null ? request.StopCount.Value : 0,
                    },
                    date);
            });
        }

        public GetJournalTrucksResponse GetJournalTrucks(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalTrucksResponse>(request, (resp, db, session) =>
            {
                var trucks = db.DBModel.Trucks
                            .Include(x =>x.JournalLocations)
                            .Where(x => x.Status == TruckStatus.Working && x.JournalLocations.Any()).ToArray();

                resp.Items = new List<JournalTruckModel>();
                foreach (var truck in trucks)
                {                    
                    var journalLocation = truck.JournalLocations.LastOrDefault();
                    var journal = journalLocation.Journal; //.Journals.FirstOrDefault(x => x.Id == journalLocation.JournalId);
                    var driver = journalLocation.User; // db.DBModel.Drivers.FirstOrDefault(x => x.Id == journalLocation.DriverId);
                    var item = new JournalTruckModel
                    {
                        LastLat = journalLocation.Latitude,
                        LastLng = journalLocation.Longitude,
                        LastStopCount = journalLocation.StopCount,
                        LastAddress = journalLocation.Address,

                        JournalId = journal.Id,
                        TruckId = truck.Id,
                        DriverId = driver.Id,
                        ActiveDate = journal.ActiveDate,
                        CreatedTS = journal.CreatedTS,
                        Description = journal.Description,
                        StartLat = journal.StartLat,
                        StartLng = journal.StartLng,
                        StartLocation = journal.StartLocation,
                        EndLat = journal.EndLat,
                        EndLng = journal.EndLng,
                        EndLocation = journal.EndLocation,
                        ExtendedData = journal.ExtendedData,
                        JournalName = journal.Name,
                        JournalStatus = (int)journal.Status,
                        LastUpdatedTS = journal.LastUpdatedTS,

                        TruckDescription= truck.Description,
                        TruckName = truck.TruckName,
                        TruckNumber = truck.TruckNumber,
                        TruckStatus = (int)truck.Status,
                        StopPoints = new List<JournalStopPointModel>(),
                    };

                    foreach (var s in journal.JournalStopPoints)
                        item.StopPoints.Add(new JournalStopPointModel(s));
                        
                    resp.Items.Add(item);
                }
            });
        }

        public GetJourneyResponse GetJourneyByTruck(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJourneyResponse>(request, (resp, db, session) =>
            {
                ValidateParam(request.JournalId);
                long journalid = request.JournalId.Value;
                ValidateParam(request.TruckId);
                long truckId = request.TruckId.Value;

                var locations = db.DBModel.JournalLocations.Include(x => x.User).Where(x => x.TruckId == truckId && x.JournalId == journalid).ToList();
                if (locations.Any())
                {
                    resp.Item = new JourneyModel();
                    resp.Item.Locations = new List<JournalLocationModel>();
                    resp.Item.Driver = new UserModel(locations[0].User);
                    foreach (var i in locations)
                        resp.Item.Locations.Add(new JournalLocationModel(i));
                }
            });
        }

        public BaseResponse StartJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long journalId = GetParam(request.JournalId, "journalId");
                long truckId = GetParam(request.TruckId, "truckId");
                long driverId = GetParam(request.DriverId, "driverId");
                
                //var lat = ValidateParamDouble(request.Latitude, "latitude");
                //var lng = ValidateParamDouble(request.Longitude, "longitude");
                //var acc = ValidateParamDouble(request.Accuracy, "accuracy");

                var journal = db.DBModel.Journals.FirstOrDefault(x=>x.Id == journalId);
                if (journal == null)
                    throw new KException("Server internal error: journal not found");

                journal.Status = JournalStatus.Started;

                var driver = journal.JournalDrivers.FirstOrDefault(x=>x.UserId == driverId);
                if (driver == null)
                    throw new KException("Server internal error: driver not found");

                driver.Status = JournalDriverStatus.Started;

                var truck = db.DBModel.Trucks.FirstOrDefault(x => x.Id == truckId);
                if (truck == null)
                    throw new KException("Server internal error: truck not found");

                truck.Status = TruckStatus.Working;

                //AddJournalLocation(db, journalId, driverId, truckId, lat, lng, acc);
                db.DBModel.JournalActivities.Add(new JournalActivity
                {
                    ActivityId = Constants.Action_BatDauHanhTrinh,
                    CreatedTS = DateTime.Now,
                    LastUpdatedTS = DateTime.Now,
                    UserId = driverId,
                    JournalId = journalId,
                });
            });
        }

        public BaseResponse EndJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long journalId = GetParam(request.JournalId, "journalId");
                long truckId = GetParam(request.TruckId, "truckId");
                long driverId = GetParam(request.DriverId, "driverId");

                //var lat = ValidateParamDouble(request.Latitude, "latitude");
                //var lng = ValidateParamDouble(request.Longitude, "longitude");
                //var acc = ValidateParamDouble(request.Accuracy, "accuracy");

                var journal = db.DBModel.Journals.FirstOrDefault(x => x.Id == journalId);
                if (journal == null)
                    throw new KException("Server internal error: journal not found");

                journal.Status = JournalStatus.Completed;

                var driver = journal.JournalDrivers.FirstOrDefault(x => x.UserId == driverId);
                if (driver == null)
                    throw new KException("Server internal error: driver not found");

                driver.Status = JournalDriverStatus.Completed;

                var truck = db.DBModel.Trucks.FirstOrDefault(x => x.Id == truckId);
                if (truck == null)
                    throw new KException("Server internal error: truck not found");

                truck.Status = TruckStatus.Actived;

                //AddJournalLocation(db, journalId, driverId, truckId, lat, lng, acc);
                db.DBModel.JournalActivities.Add(new JournalActivity
                {
                    ActivityId = Constants.Action_KetThucHanhTrinh,
                    CreatedTS = DateTime.Now,
                    LastUpdatedTS = DateTime.Now,
                    UserId = driverId,
                    JournalId = journalId,
                });
            });
        }

        public BaseResponse ReturnJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long journalId = GetParam(request.JournalId, "journalId");
                long truckId = GetParam(request.TruckId, "truckId");
                long driverId = GetParam(request.DriverId, "driverId");

                //var lat = ValidateParamDouble(request.Latitude, "latitude");
                //var lng = ValidateParamDouble(request.Longitude, "longitude");
                //var acc = ValidateParamDouble(request.Accuracy, "accuracy");

                var journal = db.DBModel.Journals.FirstOrDefault(x => x.Id == journalId);
                if (journal == null)
                    throw new KException("Server internal error: journal not found");

                journal.Status = JournalStatus.Actived;

                var driver = journal.JournalDrivers.FirstOrDefault(x => x.UserId == driverId);
                if (driver == null)
                    throw new KException("Server internal error: driver not found");

                driver.Status = JournalDriverStatus.Actived;

                var truck = db.DBModel.Trucks.FirstOrDefault(x => x.Id == truckId);
                if (truck == null)
                    throw new KException("Server internal error: truck not found");

                truck.Status = TruckStatus.Actived;

                //AddJournalLocation(db, journalId, driverId, truckId, lat, lng, acc);
                db.DBModel.JournalActivities.Add(new JournalActivity
                {
                    ActivityId = Constants.Action_ThoatHanhTrinh,
                    CreatedTS = DateTime.Now,
                    LastUpdatedTS = DateTime.Now,
                    UserId = driverId,
                    JournalId = journalId,
                });
            });
        }

        public BaseResponse TrackJournal(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long journalId = GetParam(request.JournalId, "journalId");
                long truckId = GetParam(request.TruckId, "truckId");
                long driverId = GetParam(request.DriverId, "driverId");

                var lat = ValidateParamDouble(request.Latitude, "latitude");
                var lng = ValidateParamDouble(request.Longitude, "longitude");
                var acc = ValidateParamDouble(request.Accuracy, "accuracy");

                long activityId = GetParam(request.ActivityId, "activityId");
                var activityMessage = request.ActivityMessage;

                var date = request.CreatedTS != null ? DateTime.ParseExact(request.CreatedTS, "yyyy-MM-dd HH:mm:ss", null) : DateTime.Now;

                AddJournalActivity(db, activityId, activityMessage, date, journalId, driverId, truckId);
                AddJournalLocation(
                    db,
                    null,
                    new SyncLocationModel
                    {
                        DriverId = driverId,
                        TruckId = truckId,
                        JournalId = journalId,
                        Accuracy = acc,
                        Latitude = lat,
                        Longitude = lng,
                        Address = request.Address,
                        StopCount = request.StopCount != null ? request.StopCount.Value : 0,
                    },
                    date);
            });
        }

        public BaseResponse AddJournalActivity(ServiceRequest request)
        {
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long journalId = GetParam(request.JournalId, "journalId");
                long driverId = GetParam(request.DriverId, "driverId");                
                long activityId = GetParam(request.ActivityId, "activityId");
                long truckId = GetParam(request.TruckId, "truckId");

                var activityMessage = request.ActivityMessage;
                var date = request.ActiveDate != null ? DateTime.ParseExact(request.Dob, "yyyy-MM-dd HH:mm:ss", null) : DateTime.Now;
                AddJournalActivity(db, activityId, activityMessage, date, journalId, driverId, truckId);
            });
        }

        public GetJournalsResponse GetJournalsOfDriver(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalsResponse>(request, (resp, db, session) =>
            {
                long driverId = GetParam(request.DriverId);
                var includeActivity = request.IncludeActivity == null ? false : request.IncludeActivity.Value;
                var includeAttachment = request.IncludeAttachment == null ? false : request.IncludeAttachment.Value;
                //var includeStopPoint = request.IncludeStopPoint == null ? false : request.IncludeStopPoint.Value;
                var includeDriver = request.IncludeDriver == null ? false : request.IncludeDriver.Value;

                resp.Items = new List<JournalModel>();
                var query = db.DBModel.Journals
                    .Include(x => x.JournalActivities)
                    .Include(x => x.JournalStopPoints)
                    .Include(x => x.JournalDrivers)
                    .Where(x =>(x.Status == JournalStatus.Actived || x.Status == JournalStatus.Started) && x.JournalDrivers.Any(y => y.UserId == driverId))
                    .OrderByDescending(x => x.Status).ThenBy(x => x.ActiveDate);

                var sql = query.ToString();

                var journals = query.ToArray();
                foreach (var journal in journals)
                    resp.Items.Add(CreateJournalModel(db, journal, includeActivity, includeAttachment, true, includeDriver));
            });
        }

        public BaseResponse SyncActivities(SyncActivitiesRequest request)
        {
            return Run<SyncActivitiesRequest, BaseResponse>(request, (resp, db, session) =>
            {              
                foreach (var item in request.Items)
                {
                    var date = item.CreatedTS != null ? DateTime.ParseExact(item.CreatedTS, "yyyy-MM-dd HH:mm:ss", null) : DateTime.Now;
                    AddJournalActivity(db, item.ActivityId, item.ActivityDetail, date, item.JournalId, item.DriverId, item.TruckId);
                }
            });
        }

        public BaseResponse SyncLocations(SyncLocationsRequest request)
        {
            return Run<SyncLocationsRequest, BaseResponse>(request, (resp, db, session) =>
            {
                JournalLocation lastLocation = null;
                foreach (var item in request.Items)
                {
                    var date = item.CreatedTS != null ? DateTime.ParseExact(item.CreatedTS, "yyyy-MM-dd HH:mm:ss", null) : DateTime.Now;
                    lastLocation = AddJournalLocation(db, lastLocation, item, date);
                }
            });
        }

        public BaseResponse SyncJournal(SyncRequest request)
        {
            return Run<SyncRequest, BaseResponse>(request, (resp, db, session) =>
            {
                JournalLocation lastLocation = null;
                foreach (var item in request.Locations)
                {
                    var date = item.CreatedTS != null ? DateTime.ParseExact(item.CreatedTS, "yyyy-MM-dd HH:mm:ss", null) : DateTime.Now;
                    lastLocation = AddJournalLocation(db, lastLocation, item, date);
                }

                foreach (var item in request.Activities)
                {
                    var date = item.CreatedTS != null ? DateTime.ParseExact(item.CreatedTS, "yyyy-MM-dd HH:mm:ss", null) : DateTime.Now;
                    AddJournalActivity(db, item.ActivityId, item.ActivityDetail, date, item.JournalId, item.DriverId, item.TruckId);
                }
            });
        }

        public GetJournalActivitiesResponse GetJournalActivities(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalActivitiesResponse>(request, (resp, db, session) =>
            {
                long journalId = GetParam(request.JournalId, "journalId");
                var activities = db.DBModel.JournalActivities.Include(x => x.Activity).Where(x => x.JournalId == journalId).ToArray();
                resp.Items = new List<JournalActivityModel>();
                foreach (var item in activities)
                    resp.Items.Add(new JournalActivityModel(item));
            });
        }        

        public GetJournalHistoryResponse GetJournalHistory(ServiceRequest request)
        {
            return Run<ServiceRequest, GetJournalHistoryResponse>(request, (resp, db, session) =>
            {
                long journalId = GetParam(request.JournalId, "journalId");
                var journal = db.DBModel.Journals
                    .Include(x => x.JournalActivities)
                    .Include(x => x.JournalStopPoints)
                    .Include(x => x.JournalLocations)
                    .FirstOrDefault(x => x.Id == journalId);

                if (journal == null)
                    throw new KException("Journal not found");
                resp.Item = new JournalHistoryModel(journal);
            });
        }
    }
}