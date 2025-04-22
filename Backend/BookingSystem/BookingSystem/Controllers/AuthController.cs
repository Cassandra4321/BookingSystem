using Microsoft.AspNetCore.Mvc;
using BookingSystem.API.Models;
using BookingSystem.API.Services;
using BookingSystem.API.Dtos;

namespace BookingSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
       private readonly AuthService _authService;
       public AuthController(AuthService authService)
       {
                _authService = authService;
       }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] Register register)
        {
            if (!ModelState.IsValid) return BadRequest("Invalid model.");

            var result = await _authService.RegisterUserAsync(register);
            if (result.Succeeded)
            {
                return StatusCode(StatusCodes.Status201Created);
            }
                return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] Login login)
        {
            var response = await _authService.LoginUserAsync(login);

            if (response != null)
            {
                return Ok(response);
            }

            return Unauthorized("Invalid login attempt.");
        }

    }
}
