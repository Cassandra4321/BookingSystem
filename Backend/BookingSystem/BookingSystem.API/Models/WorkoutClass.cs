using System.ComponentModel.DataAnnotations;

namespace BookingSystem.API.Models
{
    public class WorkoutClass
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string WorkoutName { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int MaxParticipants { get; set; }

        public ICollection<Booking>? Bookings { get; set; } = new List<Booking>();
    }
}
