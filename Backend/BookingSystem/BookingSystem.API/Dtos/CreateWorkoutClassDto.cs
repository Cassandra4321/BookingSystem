﻿using System.ComponentModel.DataAnnotations;

namespace BookingSystem.API.Dtos
{
    public class CreateWorkoutClassDto
    {
        [Required]
        public string WorkoutName { get; set; } = string.Empty;

        public string LongDescription { get; set; } = string.Empty;

        [Required]
        public string ShortDescription { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public int MaxParticipants { get; set; }
    }
}
