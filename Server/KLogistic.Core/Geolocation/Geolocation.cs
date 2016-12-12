using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace KLogistic
{
    public static class Geolocation
    {
        private static double CalcRad(double x)
        {
            return x * Math.PI / 180;
        }

        public static double CalcDistance(GeoPoint p1, GeoPoint p2)
        {
            var dLat = CalcRad(p2.Lat - p1.Lat);
            var dLong = CalcRad(p2.Lng - p1.Lng);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) + Math.Cos(CalcRad(p1.Lat)) * Math.Cos(CalcRad(p2.Lat)) *
                    Math.Sin(dLong / 2) * Math.Sin(dLong / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = Constants.EarthR * c;
            return Math.Round(d, 2);
        }

        public static double CalcDistance(double lat1, double lng1, double lat2, double lng2)
        {
            return CalcDistance(new GeoPoint { Lat = lat1, Lng = lng1 }, new GeoPoint { Lat = lat2, Lng = lng2 });
        }

        internal static GeoPoint MoveToNewPoint(double movedLat, double movedLng, GeoPoint curPoint)
        {
            GeoPoint newP = new GeoPoint
            {
                Lat = curPoint.Lat + (movedLat / Constants.EarthR) * (180 / Math.PI),
                Lng = curPoint.Lng + (movedLng / Constants.EarthR) * (180 / Math.PI) / Math.Cos(curPoint.Lat * Math.PI / 180)
            };
            return newP;
        }
    }
}
