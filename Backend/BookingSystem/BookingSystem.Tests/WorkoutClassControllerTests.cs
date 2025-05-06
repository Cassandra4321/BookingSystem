using BookingSystem.API.Controllers;
using BookingSystem.API.Data;
using BookingSystem.API.Models;
using BookingSystem.API.Services;
using BookingSystem.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingSystem.Tests
{
    public class WorkoutClassControllerTests
    {
        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task CreateWorkoutClass_ShouldReturnCreatedWorkoutClass()
        {
            //Arrange
            var context = GetInMemoryDbContext();
            var service = new WorkoutClassService(context);
            var controller = new WorkoutClassController(service);

            var dto = new CreateWorkoutClassDto
            {
                WorkoutName = "Yoga",
                Description = "A relaxing yoga class.",
                StartDate = DateTime.Now.AddDays(1),
                EndDate = DateTime.Now.AddDays(1).AddHours(1),
                MaxParticipants = 10
            };

            //Act
            var result = await controller.CreateWorkoutClass(dto);

            //Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdWorkoutClass = Assert.IsType<WorkoutClassDto>(createdResult.Value);
            Assert.Equal("Yoga", createdWorkoutClass.WorkoutName);
        }

        [Fact]
        public async Task GetAllWorkoutClasses_ShouldReturnAllWorkoutClasses()
        {
            var context = GetInMemoryDbContext();
            context.WorkoutClasses.Add(new WorkoutClass
            {
                WorkoutName = "Yoga1",
                Description = "A relaxing yoga class.",
                StartDate = DateTime.Now.AddDays(1),
                EndDate = DateTime.Now.AddDays(1).AddHours(1),
                MaxParticipants = 10
            });
            context.WorkoutClasses.Add(new WorkoutClass
            {
                WorkoutName = "Yoga2",
                Description = "A relaxing yoga class.2",
                StartDate = DateTime.Now.AddDays(1),
                EndDate = DateTime.Now.AddDays(1).AddHours(1),
                MaxParticipants = 15
            });
            await context.SaveChangesAsync();

            var service = new WorkoutClassService(context);
            var controller = new WorkoutClassController(service);

            //Act
            var result = await controller.GetAllWorkoutClasses();

            //Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var workoutClassList = Assert.IsAssignableFrom<IEnumerable<WorkoutClassDto>>(okResult.Value);
            Assert.Equal(2, workoutClassList.Count());

        }

        [Fact]
        public async Task DeleteWorkoutClass_WithValidId_ShouldReturnOk()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var workoutClass = new WorkoutClass
            {
                WorkoutName = "Pilates",
                Description = "Pilates session :)",
                StartDate = DateTime.Now.AddDays(1),
                EndDate = DateTime.Now.AddDays(1).AddHours(1),
                MaxParticipants = 12
            };
            context.WorkoutClasses.Add(workoutClass);
            await context.SaveChangesAsync();

            var service = new WorkoutClassService(context);
            var controller = new WorkoutClassController(service);

            // Act
            var result = await controller.DeleteWorkoutClass(workoutClass.Id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal($"Booking with ID {workoutClass.Id} deleted successfully.", okResult.Value);
        }

        [Fact]
        public async Task DeleteWorkoutClass_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var service = new WorkoutClassService(context);
            var controller = new WorkoutClassController(service);
            int invalidId = 999;

            // Act
            var result = await controller.DeleteWorkoutClass(invalidId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal($"Workout class with ID {invalidId} not found.", notFoundResult.Value);
        }

    }
}
