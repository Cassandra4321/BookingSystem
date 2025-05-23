using BookingSystem.API.Dtos;
using Microsoft.EntityFrameworkCore;
using BookingSystem.API.Data;

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

            if (user.Bookings == null || user.Bookings.Count == 0)
            {
                return Enumerable.Empty<WorkoutClassDto>();
            }

            var favorite = user.Bookings
                .GroupBy(b => b.WorkoutClass.WorkoutName)
                .OrderByDescending(g => g.Count())
                .Select(g => g.Key)
                .FirstOrDefault();

            if (favorite == null)
            {
                return Enumerable.Empty<WorkoutClassDto>();
            }

            var bookedClassIds = user.Bookings
            .Select(b => b.WorkoutClassId)
                .ToList();

            var recommendedClass = await _context.WorkoutClasses
                .Include(wc => wc.Bookings)
                .Where(wc => wc.WorkoutName == favorite &&
                             wc.StartDate > DateTime.Now &&
                             !bookedClassIds.Contains(wc.Id))
                .OrderBy(wc => wc.StartDate)
                .FirstOrDefaultAsync(); 

            if (recommendedClass == null)
            {
                return Enumerable.Empty<WorkoutClassDto>();
            }

            return new List<WorkoutClassDto>
            {
                new WorkoutClassDto
                {
                    Id = recommendedClass.Id,
                    WorkoutName = recommendedClass.WorkoutName,
                    Description = recommendedClass.Description,
                    StartDate = recommendedClass.StartDate,
                    EndDate = recommendedClass.EndDate,
                    MaxParticipants = recommendedClass.MaxParticipants,
                    BookingIds = recommendedClass.Bookings?.Select(b => b.Id).ToList() ?? new List<int>()
                }
            };
        }
    }
}
