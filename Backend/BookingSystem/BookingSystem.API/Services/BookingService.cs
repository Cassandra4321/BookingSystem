using BookingSystem.API.Data;
using BookingSystem.API.Models;
using BookingSystem.API.Dtos;
using Microsoft.EntityFrameworkCore;
using BookingSystem.API.Mappers;

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

            return bookings.Select(BookingMapper.MapToDto).ToList();
        }

        public async Task<BookingOutputDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkoutClass)
                .FirstOrDefaultAsync(b => b.Id == id);

            return booking == null ? null : BookingMapper.MapToDto(booking);
        }

        public async Task<BookingOutputDto?> CreateBookingAsync(BookingInputDto dto)
        {
            bool alreadyBooked = await _context.Bookings.AnyAsync(b =>
            b.UserId == dto.UserId &&
            b.WorkoutClassId == dto.WorkoutClassId);

            if (alreadyBooked)
            {
                return null;
            }

            var workoutClass = await _context.WorkoutClasses
                .Include(w => w.Bookings)
                .FirstOrDefaultAsync(w => w.Id == dto.WorkoutClassId);

            if (workoutClass == null)
            {
                return null;
            }
            if ((workoutClass.Bookings?.Count ?? 0) >= workoutClass.MaxParticipants)
            {
                return null;
            }

            var booking = new Booking
            {
                UserId = dto.UserId,
                WorkoutClassId = dto.WorkoutClassId,
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            var fullBooking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkoutClass)
                .FirstOrDefaultAsync(b => b.Id == booking.Id);

            if (fullBooking == null)
            {
                return null;
            }

            return BookingMapper.MapToDto(fullBooking);
        }

        public async Task<List<BookingOutputDto>> GetBookingForUserAsync(string userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkoutClass)
                .ThenInclude(w => w.Bookings)
                .Where(b => b.UserId == userId)
                .ToListAsync();

            return bookings.Select(BookingMapper.MapToDto).ToList();
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

        public async Task<List<BookingOutputDto>> GetOnlyUpcomingBookingsForUserAsync(string userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.WorkoutClass)
                .ThenInclude(w => w.Bookings)
                .Where(b => b.UserId == userId && b.WorkoutClass.StartDate > DateTime.Now)
                .ToListAsync();

            return bookings.Select(BookingMapper.MapToDto).ToList();
        }
    }
}
