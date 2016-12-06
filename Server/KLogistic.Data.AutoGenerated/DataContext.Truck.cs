using System.Linq;
using System.Collections.Generic;
using System.Data;

namespace KLogistic.Data
{
    public partial class DataContext
    {
        public void AddTruck(Truck truck)
        {
            truck.Validate();
            DBModel.Trucks.Add(truck);
        }

        public Truck GetTruck(long id)
        {
            return DBModel.Trucks.FirstOrDefault(x=> x.Id == id);
        }

        public void RemoveTruck(Truck truck)
        {
            DBModel.Trucks.Remove(truck);
        }

        public IQueryable<Truck> GetTrucks()
        {
            return DBModel.Trucks;
        }     
    }
}
