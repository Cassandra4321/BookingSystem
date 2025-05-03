namespace BookingSystem.API.Dtos
{
    public class WorkoutClassDto
    {
        public int Id { get; set; }
        public string WorkoutName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int MaxParticipants { get; set; }
        public List<int> BookingIds { get; set; } = new();
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
