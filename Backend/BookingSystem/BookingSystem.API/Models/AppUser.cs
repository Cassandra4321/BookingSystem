using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BookingSystem.API.Models
{
    public class AppUser : IdentityUser
    {

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        public bool IsAdmin { get; set; } = false;

        public ICollection<Booking>? Bookings { get; set; }
    }
}
