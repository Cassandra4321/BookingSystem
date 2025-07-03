using BookingSystem.API.Dtos;
using BookingSystem.API.Models;

namespace BookingSystem.API.Mappers
{
    public static class BookingMapper
    {
        public static BookingOutputDto MapToDto(Booking booking)
        {
            return new BookingOutputDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                UserName = booking.User.FirstName,
                WorkoutClassId = booking.WorkoutClassId,
                WorkoutClassName = booking.WorkoutClass.WorkoutName,
                StartDate = booking.WorkoutClass.StartDate,
                EndDate = booking.WorkoutClass.EndDate,
                LongDescription = booking.WorkoutClass.LongDescription,
                ShortDescription = booking.WorkoutClass.ShortDescription,
                MaxParticipants = booking.WorkoutClass.MaxParticipants,
                CurrentParticipants = booking.WorkoutClass.Bookings?.Count ?? 0
            };
        }
    }
}
