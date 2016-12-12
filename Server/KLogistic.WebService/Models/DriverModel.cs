using KLogistic.Data;
using System;
using System.Runtime.Serialization;

namespace KLogistic.WebService
{
    [DataContract]
    public class DriverModel : UserModel
    {
        [DataMember(Name = "licenseNo")]
        public string LicenseNo { get; set; }

        [DataMember(Name = "classType")]
        public string ClassType { get; set; }

        [DataMember(Name = "issuedPlace")]
        public string IssuedPlace { get; set; }

        [DataMember(Name = "expiredDate")]
        public DateTime? ExpiredDate { get; set; }

        [DataMember(Name = "issuedDate")]
        public DateTime? IssuedDate { get; set; }

        [DataMember(Name = "truckId")]
        public long TruckId { get; set; }

        [DataMember(Name = "truck")]
        public TruckModel Truck { get; set; }
        
        public DriverModel() { }

        public DriverModel(Driver driver) : base(driver)
        {
            LicenseNo = driver.LicenseNo;
            ClassType = driver.ClassType;
            IssuedDate = driver.IssuedDate;
            IssuedPlace = driver.IssuedPlace;
            ExpiredDate = driver.ExpiredDate;
            TruckId = driver.TruckId ?? 0;
            if (driver.Truck != null)
                Truck = new TruckModel(driver.Truck);

            //CreatedTS = driver.CreatedTS;
            //LastUpdatedTS = driver.LastUpdatedTS;
        }
    }
}