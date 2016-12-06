using FileHelpers;

namespace KLogistic.ServiceHost
{
    [DelimitedRecord(",")]
    public class JournalRow
    {
        [FieldOrder(1)]
        public string Shipmentcode { get; set; }
        [FieldOrder(2)]
        public string TruckNo { get; set; }
        [FieldOrder(3)]
        public string DriverName { get; set; }
        [FieldOrder(4)]
        public string Start { get; set; }
        [FieldOrder(5)]
        public string Destination { get; set; }
        [FieldOrder(6)]
        public string TotalDistance { get; set; }
        [FieldOrder(7)]
        public string TotalDuration { get; set; }
        [FieldOrder(8)]
        public string CurrentLocation { get; set; }
        [FieldOrder(9)]
        public string EstimatedDistanceToDestination { get; set; }
        [FieldOrder(10)]
        public string Note { get; set; }

        //Shipment code: CZ.BN9.16 - Truck No: 29C33224 - Time: 09:23:35 19/09/2016
        //Truck No    29C33224
        //Total Km	680
        //Time	09:23:02 19/09/2016
        //Current Location    X.Yên Trung, Yên Phong, Bắc Ninh
        //Cont No TRLU7005737
        //Seal    F1085651
        //Shipment code CZ.BN9.16
        //Destination KA GARAGAE
        //Estimated distance to Destination (Km)  50,16
        //Note
    }
}
