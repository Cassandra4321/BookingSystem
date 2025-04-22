using BookingSystem.API.Data;
using BookingSystem.API.Models;
using BookingSystem.API.Dtos;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.API.Services
{
    public class BookingService
    {
        private readonly AppDbContext _context;

        public BookingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BookingOutputDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkoutClass)
                .ToListAsync();

            return bookings.Select(MapToDto).ToList();
        }

        public async Task<BookingOutputDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkoutClass)
                .FirstOrDefaultAsync(b => b.Id == id);

            return booking == null ? null : MapToDto(booking);
        }

        public async Task<Booking?> CreateBookingAsync(BookingInputDto dto)
        {
            bool alreadyBooked = await _context.Bookings.AnyAsync(b =>
            b.UserId == dto.UserId &&
            b.WorkoutClassId == dto.WorkoutClassId);

            if (alreadyBooked)
            {
                return null;
            }
            var booking = new Booking
            {
                UserId = dto.UserId,
                WorkoutClassId = dto.WorkoutClassId
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<List<BookingOutputDto>> GetBookingForUserAsync(string userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkoutClass)
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return bookings.Select(MapToDto).ToList();
        }

        public async Task<bool> DeleteBookingAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return false;
            }
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return true;
        }

        private static BookingOutputDto MapToDto(Booking booking)
        {
            return new BookingOutputDto
            {
                Id = booking.Id,
                UserId = booking.UserId,
                UserName = booking.User.FirstName,
                WorkoutClassId = booking.WorkoutClassId,
                WorkoutClassName = booking.WorkoutClass.WorkoutName,
                StartDate = booking.WorkoutClass.StartDate,
                EndDate = booking.WorkoutClass.EndDate
            };
        }
    }
}
