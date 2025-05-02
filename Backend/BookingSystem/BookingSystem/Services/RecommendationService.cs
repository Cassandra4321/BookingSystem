using BookingSystem.API.Data;
using Microsoft.EntityFrameworkCore;
using BookingSystem.API.Dtos;

namespace BookingSystem.API.Services
{
    public class RecommendationService
    {
        private readonly AppDbContext _context;

        public RecommendationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkoutClassDto>> GetRecommendedClassesAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Bookings!)
                .ThenInclude(b => b.WorkoutClass)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Enumerable.Empty<WorkoutClassDto>();
            }
                

            var favoriteTypes = user.Bookings
                .GroupBy(b => b.WorkoutClass.WorkoutName)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .ToList();

            if (!favoriteTypes.Any())
            {
                return new List<WorkoutClassDto>();
            }

            var favorite = favoriteTypes.First();

            var bookedClassIds = user.Bookings.Select(b => b.WorkoutClassId).ToList();

            var recommendedClasses = await _context.WorkoutClasses
                .Where(wc => wc.WorkoutName == favorite && 
                    wc.StartDate > DateTime.Now
                    && !bookedClassIds.Contains(wc.Id))
                .OrderBy(wc => wc.StartDate)
                .ToListAsync();

            var recommendedClassDtos = recommendedClasses.Select(wc => new WorkoutClassDto
            {
                Id = wc.Id,
                Name = wc.WorkoutName,
                Description = wc.Description,
                StartDate = wc.StartDate,
                EndDate = wc.EndDate
            }).ToList();

            return recommendedClassDtos;
        }
    }
}
