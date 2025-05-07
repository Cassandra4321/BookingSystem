namespace BookingSystem.API.Dtos
{
    public class BookingOutputDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string WorkoutClassName { get; set; } = null!;
        public int WorkoutClassId { get; set; }
        public string Description { get; set; } = string.Empty;
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
