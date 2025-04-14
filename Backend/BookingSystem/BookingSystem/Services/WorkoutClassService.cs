using BookingSystem.API.Data;
using BookingSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using BookingSystem.API.Dtos;

namespace BookingSystem.API.Services
{
    public class WorkoutClassService
    {
        private readonly AppDbContext _context;

        public WorkoutClassService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutClass>> GetAllWorkoutClassesAsync()
        {
            return await _context.WorkoutClasses.ToListAsync();
        }

        public async Task<WorkoutClass> GetWorkoutClassByIdAsync(int id)
        {
            return await _context.WorkoutClasses
                .Include(w => w.Bookings)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<WorkoutClass> CreateWorkoutClassAsync(CreateWorkoutClassDto dto)
        {
            var workoutClass = new WorkoutClass
            {
                WorkoutName = dto.WorkoutName,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                MaxParticipants = dto.MaxParticipants
            };
            _context.WorkoutClasses.Add(workoutClass);
            await _context.SaveChangesAsync();
            return workoutClass;
        }

        public async Task<bool> UpdateWorkoutClassAsync(int id, UpdateWorkoutClassDto dto)
        {
            var existingWorkoutClass = await _context.WorkoutClasses.FindAsync(id);
            if (existingWorkoutClass == null)
            {
                return false;
            }

            existingWorkoutClass.WorkoutName = dto.WorkoutName;
            existingWorkoutClass.Description = dto.Description;
            existingWorkoutClass.StartDate = dto.StartDate;
            existingWorkoutClass.EndDate = dto.EndDate;
            existingWorkoutClass.MaxParticipants = dto.MaxParticipants;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteWorkoutClassAsync(int id)
        {
            var workoutClass = await _context.WorkoutClasses.FindAsync(id);
            if (workoutClass == null)
            {
                return false;
            }
            _context.WorkoutClasses.Remove(workoutClass);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
