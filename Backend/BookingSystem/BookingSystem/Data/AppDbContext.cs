using BookingSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<WorkoutClass> WorkoutClasses { get; set; }
        public DbSet<Booking> Bookings { get; set; }
    }
}
