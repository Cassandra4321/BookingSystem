using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookingSystem.API.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey("UserId")]
        public AppUser User { get; set; } = null!;

        [Required]
        public int WorkoutClassId { get; set; }

        [ForeignKey("WorkoutClassId")]
        public WorkoutClass WorkoutClass { get; set; } = null!;
    }
}
