namespace BookingSystem.API.Dtos
{
    public class UpdateWorkoutClassDto
    {
        public string WorkoutName { get; set; } = string.Empty;
        public string LongDescription { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int MaxParticipants { get; set; }
    }
}
