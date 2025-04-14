using BookingSystem.API.Models;
using BookingSystem.API.Services;
using Microsoft.AspNetCore.Mvc;
using BookingSystem.API.Dtos;

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
        public async Task<ActionResult<IEnumerable<WorkoutClass>>> GetAllWorkoutClasses()
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
        public async Task<ActionResult<WorkoutClass>> GetWorkoutClassById(int id)
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
        public async Task<ActionResult<WorkoutClass>> CreateWorkoutClass([FromBody] CreateWorkoutClassDto dto)
        {
            var createdWorkoutClass = await _workoutClassService.CreateWorkoutClassAsync(dto);
            return CreatedAtAction(nameof(GetWorkoutClassById), new { id = createdWorkoutClass.Id }, createdWorkoutClass);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateWorkoutClass(int id, [FromBody] UpdateWorkoutClassDto dto)
        {
            var success = await _workoutClassService.UpdateWorkoutClassAsync(id, dto);

            if (!success)
            {
                return NotFound($"Workout class with ID {id} not found.");
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteWorkoutClass(int id)
        {
            var success = await _workoutClassService.DeleteWorkoutClassAsync(id);
            if (!success)
            {
                return NotFound($"Workout class with ID {id} not found.");
            }
            return NoContent();
        }
    }
}
