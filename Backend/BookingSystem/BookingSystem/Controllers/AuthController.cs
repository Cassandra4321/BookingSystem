using Microsoft.AspNetCore.Mvc;
using BookingSystem.API.Models;
using BookingSystem.API.Services;

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
            if (ModelState.IsValid)
            {
                var result = await _authService.RegisterUserAsync(register);
                if (result.Succeeded)
                {
                    return Created();
                }
                return BadRequest(result.Errors);
            }
            return BadRequest("Invalid model.");
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseTypeAttribute(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            var result = await _authService.LoginUserAsync(login);
            if (result.Succeeded)
            {
                return Ok("User logged in successfully!");
            }
            return Unauthorized("Invalid login attempt.");
        }

    }
}
