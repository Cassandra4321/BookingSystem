using System.ComponentModel.DataAnnotations;

namespace BookingSystem.API.Models
{
    public class Booking
    {
        [Required]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int WorkoutClassId { get; set; }
        public WorkoutClass? WorkoutClass { get; set; }
    }
}
