using BookingSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace BookingSystem.API.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<WorkoutClass> WorkoutClasses { get; set; }
        public DbSet<Booking> Bookings { get; set; }
    }
}
