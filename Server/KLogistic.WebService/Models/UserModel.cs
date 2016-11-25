using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KLogistic.WebService
{
    [DataContract]
    public class UserModel : BaseModel
    {
        [DataMember(Name = "id")]
        public long Id { get; set; }

        [DataMember(Name = "userName")]
        public string Username { get; set; }

        [DataMember(Name = "role")]
        public int Role { get; set; }

        [DataMember(Name = "firstName")]
        public string FirstName { get; set; }

        [DataMember(Name = "lastName")]
        public string LastName { get; set; }

        [DataMember(Name = "ssn")]
        public string SSN { get; set; }

        [DataMember(Name = "address")]
        public string Address { get; set; }

        [DataMember(Name = "dob")]
        public DateTime DOB { get; set; }

        [DataMember(Name = "phone")]
        public string Phone { get; set; }

        [DataMember(Name = "email")]
        public string Email { get; set; }

        [DataMember(Name = "note")]
        public string Note { get; set; }

        [DataMember(Name = "status")]
        public int Status { get; set; }

        public UserModel()
        {
        }

        public UserModel(User user)
        {
            Address = user.Address;
            DOB = user.DOB != null ? user.DOB.Value : new DateTime(1980, 1, 1);
            Email = user.Email;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Note = user.Note;
            Phone = user.Phone;
            Id = user.Id;
            Role = (int)user.Role;
            SSN = user.SSN;
            Username = user.Username;
            Status = (int)user.Status;
            LastUpdatedTS = user.LastUpdatedTS;
            CreatedTS = user.CreatedTS;
        }
    }
}