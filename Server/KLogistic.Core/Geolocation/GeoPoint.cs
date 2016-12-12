using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic
{
    public class GeoPoint
    {
        public double Lat { get; set; }
        public double Lng { get; set; }

        public GeoPoint MoveTo(double movedLat, double movedLng)
        {
            return Geolocation.MoveToNewPoint(movedLat, movedLng, this);
        }
    }
}
