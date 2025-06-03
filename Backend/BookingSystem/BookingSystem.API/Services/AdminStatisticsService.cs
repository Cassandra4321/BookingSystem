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

            var allBookings = await _context.Bookings
                .Include(b => b.WorkoutClass)
                .ToListAsync();

            var popularClasses = allBookings
                .GroupBy(b => b.WorkoutClass.WorkoutName)
                .Select(g => new WorkoutClassStats
                {
                    WorkoutName = g.Key,
                    BookingCount = g.Count()
                })
                .OrderByDescending(c => c.BookingCount)
                .Take(1)
                .ToList();

            return new AdminStatsDtos
            {
                TotalUsers = totalUsers,
                TotalBookings = totalBookings,
                TotalWorkoutClasses = totalWorkoutClasses,
                MostPopularClasses = popularClasses,
            };
        }
    }
}
