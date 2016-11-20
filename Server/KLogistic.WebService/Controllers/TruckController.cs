using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Linq;
using System.Data.Entity;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        public GetTrucksResponse GetTrucks(ServiceRequest request)
        {            
            return Run<Request, GetTrucksResponse>(request, (resp, db, session) =>
            {
                resp.Items = new System.Collections.Generic.List<TruckModel>();
                var items = db.GetTrucks();
                foreach (var item in items)
                    resp.Items.Add(new TruckModel(item));
            });
        }

        public GetTruckResponse GetTruck(ServiceRequest request)
        {
           return Run<Request, GetTruckResponse>(request, (resp, db, session) =>
           {
               ValidateParam(request.TruckId);
               long truckId = request.TruckId.Value;

               var truck = db.GetTruck(truckId);
               if (truck == null)
                   throw new KException("Truck is not found");

               resp.Item = new TruckModel(truck);
           });
        }

        public Response UpdateTruck(ServiceRequest request)
        {           
            return Run<Request, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.TruckId);
                long truckId = request.TruckId.Value;

                string name = request.Name;
                string number = request.Number;
                string description = request.Description;

                var truck = db.GetTruck(truckId);
                if (truck == null)
                    throw new KException("Truck is not found");

                if (name != null) truck.TruckName = name;
                if (number != null) truck.TruckNumber = number;
                if (description != null) truck.Description = description;

                truck.LastUpdatedTS = DateTime.Now;
            });
        }

        public GetTruckResponse AddTruck(ServiceRequest request)
        {          
            return Run<Request, GetTruckResponse>(request, (resp, db, session) =>
            {
                string name = request.Name;
                string number = request.Number;
                string description = request.Description;

                var truck = new Truck();
                truck.TruckName = name;
                truck.TruckNumber = number;
                truck.Description = description;                
                truck.LastUpdatedTS = DateTime.Now;
                truck.CreatedTS = DateTime.Now;
                truck.Status = Status.Actived;

                db.AddTruck(truck);

                db.SaveChanges();
                resp.Item = new TruckModel(truck);
            }, false);
        }

        public Response BlockTruck(ServiceRequest request)
        {            
            return Run<Request, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.TruckId);
                long truckId = request.TruckId.Value;

                var truck = db.GetTruck(truckId);
                if (truck == null)
                    throw new KException("Truck is not found");

                truck.Status = Status.Blocked;
                truck.LastUpdatedTS = DateTime.Now;
            }, false);
        }

        public Response UnblockTruck(ServiceRequest request)
        {
            return Run<Request, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.TruckId);
                long truckId = request.TruckId.Value;

                var truck = db.GetTruck(truckId);
                if (truck == null)
                    throw new KException("Truck is not found");

                truck.Status = Status.Actived;
                truck.LastUpdatedTS = DateTime.Now;
            }, false);
        }

        public GetTrucksResponse GetBlockedTrucks(ServiceRequest request)
        {            
            return Run<Request, GetTrucksResponse>(request, (resp, db, session) =>
            {
                resp.Items = new System.Collections.Generic.List<TruckModel>();
                var trucks = db.DBModel.Trucks.Where(x=>x.Status == Status.Blocked);
                foreach (var truck in trucks)
                    resp.Items.Add(new TruckModel(truck));
            }, false);
        }

        public Response RemoveTruck(ServiceRequest request)
        {            
            return Run<Request, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.TruckId);
                long truckId = request.TruckId.Value;

                var truck = db.GetTruck(truckId);
                if (truck == null)
                    throw new KException("Truck is not found");

                if (truck.Status == Status.Inactived)
                    db.RemoveTruck(truck);
                else
                {
                    truck.Status = Status.Deleted;
                    truck.LastUpdatedTS = DateTime.Now;
                }
            }, false);
        }

        public Response RestoreTruck(ServiceRequest request)
        {           
            return Run<Request, Response>(request, (resp, db, session) =>
            {
                ValidateParam(request.TruckId);
                long truckId = request.TruckId.Value;

                var truck = db.GetTruck(truckId);
                if (truck == null)
                    throw new KException("Truck is not found");

                truck.Status = Status.Actived;
                truck.LastUpdatedTS = DateTime.Now;
            }, false);
        }
    }
}