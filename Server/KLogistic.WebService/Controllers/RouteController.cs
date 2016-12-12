using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        public GetRoutesResponse GetRoutes(ServiceRequest request)
        {
            return Run<ServiceRequest, GetRoutesResponse>(request, (resp, db, session) =>
            {
                resp.Items = new List<RouteModel>();
                var items = db.DBModel.Routes.Where(x => x.Status != Status.Deleted);
                foreach (var i in items)
                    resp.Items.Add(new RouteModel(i));
            });
        }

        public GetRouteResponse GetRoute(ServiceRequest request)
        {
            return Run<ServiceRequest, GetRouteResponse>(request, (resp, db, session) =>
            {
                var routeId = GetParam(request.RouteId);
                var item = db.DBModel.Routes.FirstOrDefault(x => x.Id == routeId);
                if (item == null)
                    throw new KException("Route is not found");

                resp.Item = new RouteModel(item);
            });
        }

        public BaseResponse UpdateRoute(ServiceRequest request)
        {            
            return Run<ServiceRequest, BaseResponse>(request, (resp, db, session) =>
            {
                long routeId = GetParam(request.RouteId);
                var route = db.DBModel.Routes.FirstOrDefault(x => x.Id == routeId);
                if (route == null)
                    throw new KException("Route is not found");
                
                if (request.Name != null) route.Name = request.Name;
                if (request.RoutePoints != null) route.Data = request.RoutePoints; // should be json
                if (request.Status != null) route.Status = (Status)request.Status;
                route.LastUpdatedTS = DateTime.Now;
            });
        }

        public GetRouteResponse AddRoute(ServiceRequest request)
        {
            return Run<ServiceRequest, GetRouteResponse>(request, (resp, db, session) =>
            {
                var route = new JournalRoute {
                    CreatedTS = DateTime.Now,
                    LastUpdatedTS = DateTime.Now,
                    Name = request.Name,
                    Status = (Status)(request.Status ?? 0),
                    Data = request.RoutePoints
                };

                db.DBModel.Routes.Add(route);
                db.SaveChanges();
                resp.Item = new RouteModel(route);
            }, false);
        }
                
        public BaseResponse RemoveRoute(ServiceRequest request)
        {            
            return Run<ServiceRequest, GetDriversResponse>(request, (resp, db, session) =>
            {
                long routeId = GetParam(request.RouteId);

                var route = db.DBModel.Routes.FirstOrDefault(x=>x.Id == routeId);
                if (route != null)
                {
                    if (db.DBModel.Journals.Any(x => x.RouteId == routeId))
                        route.Status = Status.Deleted;
                    else
                        db.DBModel.Routes.Remove(route);
                }
            });
        }        
    }
}