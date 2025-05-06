using BookingSystem.API.Models;
using BookingSystem.API.Services;
using Microsoft.AspNetCore.Mvc;
using BookingSystem.API.Dtos;
using BookingSystem.API.Mappers;

namespace BookingSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutClassController : Controller
    {
        private readonly WorkoutClassService _workoutClassService;

        public WorkoutClassController(WorkoutClassService workoutClassService)
        {
            _workoutClassService = workoutClassService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<WorkoutClassDto>>> GetAllWorkoutClasses()
        {
            var workoutClasses = await _workoutClassService.GetAllWorkoutClassesAsync();
            if (workoutClasses == null || !workoutClasses.Any())
            {
                return NotFound("No workout classes found.");
            }
            return Ok(workoutClasses);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WorkoutClassDto>> GetWorkoutClassById(int id)
        {
            var workoutClass = await _workoutClassService.GetWorkoutClassByIdAsync(id);
            if (workoutClass == null)
            {
                return NotFound($"Workout class with ID {id} not found.");
            }
            return Ok(workoutClass);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<WorkoutClassDto>> CreateWorkoutClass([FromBody] CreateWorkoutClassDto dto)
        {
            var createdWorkoutClass = await _workoutClassService.CreateWorkoutClassAsync(dto);
            var createdWorkoutClassDto = WorkoutClassMapper.ToDto(createdWorkoutClass);

            return CreatedAtAction(nameof(GetWorkoutClassById), new { id = createdWorkoutClass.Id }, createdWorkoutClassDto);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateWorkoutClass(int id, [FromBody] UpdateWorkoutClassDto dto)
        {
            var updateWorkoutClass = await _workoutClassService.UpdateWorkoutClassAsync(id, dto);

            if (updateWorkoutClass == null)
            {
                return NotFound($"Workout class with ID {id} not found.");
            }
            return Ok(updateWorkoutClass);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteWorkoutClass(int id)
        {
            var deleted = await _workoutClassService.DeleteWorkoutClassAsync(id);
            if (!deleted)
            {
                return NotFound($"Workout class with ID {id} not found.");
            }
            return Ok($"Booking with ID {id} deleted successfully.");
        }
    }
}
