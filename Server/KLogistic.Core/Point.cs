using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic
{
    public class Point
    {
        public double Lat { get; set; }
        public double Lng { get; set; }

        public Point MoveTo(double movedLat, double movedLng)
        {
            return Utils.MoveToNewPoint(movedLat, movedLng, this);
        }
    }
}
