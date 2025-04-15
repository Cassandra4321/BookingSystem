namespace BookingSystem.API.Dtos
{
    public class BookingInputDto
    {
        public string UserId { get; set; } = null!;
        public int WorkoutClassId { get; set; }
    }
}
