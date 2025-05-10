using BookingSystem.API.Data;
using BookingSystem.API.Dtos;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.API.Services
{
    public class AdminStatisticsService
    {
        private readonly AppDbContext _context;
        public AdminStatisticsService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<AdminStatsDtos> GetStatisticsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalBookings = await _context.Bookings.CountAsync();
            var totalWorkoutClasses = await _context.WorkoutClasses.CountAsync();

            var mostPopular = await _context.WorkoutClasses
                .Include(c => c.Bookings)
                .ToListAsync();

            var top = mostPopular
                .Select(c => new WorkoutClassStats
                {
                    WorkoutName = c.WorkoutName,
                    BookingCount = c.Bookings?.Count ?? 0
                })
                .OrderByDescending(c => c.BookingCount)
                .Take(1)
                .ToList();

            return new AdminStatsDtos
            {
                TotalUsers = totalUsers,
                TotalBookings = totalBookings,
                TotalWorkoutClasses = totalWorkoutClasses,
                MostPopularClasses = top
            };
        }
    }
}
