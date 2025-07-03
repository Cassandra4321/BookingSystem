using BookingSystem.API.Dtos;
using BookingSystem.API.Models;

namespace BookingSystem.API.Mappers
{
    public static class WorkoutClassMapper
    {
        public static WorkoutClassDto ToDto(WorkoutClass workoutClass)
        {
            return new WorkoutClassDto
            {
                Id = workoutClass.Id,
                WorkoutName = workoutClass.WorkoutName,
                LongDescription = workoutClass.LongDescription,
                ShortDescription = workoutClass.ShortDescription,
                MaxParticipants = workoutClass.MaxParticipants,
                BookingIds = workoutClass.Bookings?.Select(b => b.Id).ToList() ?? new List<int>(),
                StartDate = workoutClass.StartDate,
                EndDate = workoutClass.EndDate
            };
        }
    }
}
