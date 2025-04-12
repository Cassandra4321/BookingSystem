using System.ComponentModel.DataAnnotations;

namespace BookingSystem.API.Models
{
    public class User
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = null!;

        [Required]
        public string LastName { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public bool IsAdmin { get; set; } = false;

        public ICollection<Booking>? Bookings { get; set; }
    }
}
