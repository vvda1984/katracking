using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KLogistic
{
    public class Constants
    {
        public const float AcceptedDistance = 50;
        public const double EarthR = 6378137; // 6378137: meter

        public const long Action_BatDauHanhTrinh = 1;
        public const long Action_DenDiemNhanHang = 2;
        public const long Action_XuatPhat = 3;
        public const long Action_TacDuong = 4;
        public const long Action_XeHong = 5;
        public const long Action_DenDienTraHang = 6;
        public const long Action_BatDauTraHang = 7;
        public const long Action_KetThucTraHang = 8;
        public const long Action_GuiThongBao = 9;
        public const long Action_TraHanhTrinh = 10;
        public const long Action_KetThucHanhTrinh = 100; 
    }

    public class ReturnCode
    {
        public const int Error = -1;
    }
}