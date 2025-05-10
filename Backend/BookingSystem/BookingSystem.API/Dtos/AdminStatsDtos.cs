namespace BookingSystem.API.Dtos
{
    public class AdminStatsDtos
    {
        public int TotalUsers { get; set; }
        public int TotalBookings { get; set; }
        public int TotalWorkoutClasses { get; set; }
        public List<WorkoutClassStats> MostPopularClasses { get; set; } = new();    

    }
    public class WorkoutClassStats
    {
        public string WorkoutName { get; set; } = string.Empty;
        public int BookingCount { get; set; }
    }
}
