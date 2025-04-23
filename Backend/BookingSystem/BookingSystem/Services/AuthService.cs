using BookingSystem.API.Models;
using Microsoft.AspNetCore.Identity;
using BookingSystem.API.Dtos;

namespace BookingSystem.API.Services
{
    public class AuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly JwtService _jwtService;
        public AuthService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, JwtService jwtService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
        }

        public async Task<IdentityResult> RegisterUserAsync(Register register)
        {
            var user = new AppUser
            {
                FirstName = register.FirstName,
                LastName = register.LastName,
                UserName = register.Email,
                Email = register.Email,
                IsAdmin = false,

            };

            return await _userManager.CreateAsync(user, register.Password);
        }

        public async Task<LoginResponseDto?> LoginUserAsync(Login login)
        {
            var user = await _userManager.FindByEmailAsync(login.Email);
            if (user != null)
            {
                var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);
                if (result.Succeeded)
                {
                    var token = _jwtService.GenerateToken(user);
                    return new LoginResponseDto
                    {
                        Token = token,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        IsAdmin = user.IsAdmin,
                        UserId = user.Id
                    };
                }
            }
            return null;
        }
    }
}
