using BookingSystem.API.Data;
using BookingSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using BookingSystem.API.Dtos;
using BookingSystem.API.Mappers;

namespace BookingSystem.API.Services
{
    public class WorkoutClassService
    {
        private readonly AppDbContext _context;

        public WorkoutClassService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutClassDto>> GetAllWorkoutClassesAsync()
        {
            var workoutClasses = await _context.WorkoutClasses
                .Include(w => w.Bookings)
                .ToListAsync();

            return workoutClasses.Select(WorkoutClassMapper.ToDto).ToList();
        }

        public async Task<WorkoutClassDto?> GetWorkoutClassByIdAsync(int id)
        {
            var workoutClass = await _context.WorkoutClasses
                .Include(w => w.Bookings)
                .FirstOrDefaultAsync(w => w.Id == id);
            return workoutClass == null ? null : WorkoutClassMapper.ToDto(workoutClass);
        }

        public async Task<WorkoutClass> CreateWorkoutClassAsync(CreateWorkoutClassDto dto)
        {
            var workoutClass = new WorkoutClass
            {
                WorkoutName = dto.WorkoutName,
                LongDescription = dto.LongDescription,
                ShortDescription = dto.ShortDescription,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                MaxParticipants = dto.MaxParticipants
            };
            _context.WorkoutClasses.Add(workoutClass);
            await _context.SaveChangesAsync();
            return workoutClass;
        }

        public async Task<WorkoutClass?> UpdateWorkoutClassAsync(int id, UpdateWorkoutClassDto dto)
        {
            var existingWorkoutClass = await _context.WorkoutClasses.FindAsync(id);
            if (existingWorkoutClass == null)
            {
                return null;
            }

            existingWorkoutClass.WorkoutName = dto.WorkoutName;
            existingWorkoutClass.LongDescription = dto.LongDescription;
            existingWorkoutClass.ShortDescription = dto.ShortDescription;
            existingWorkoutClass.StartDate = dto.StartDate;
            existingWorkoutClass.EndDate = dto.EndDate;
            existingWorkoutClass.MaxParticipants = dto.MaxParticipants;

            await _context.SaveChangesAsync();
            return existingWorkoutClass;
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
