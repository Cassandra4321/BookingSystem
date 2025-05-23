using BookingSystem.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BookingSystem.API.Services
{
    /// <summary>
    /// Service responsible for generating JSON Web Tokens (JWT) for user authentication. 
    /// </summary>
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Injects application configuration to access JWT-related settings.
        /// </summary>
        /// <param name="configuration">App configuration (appsettings.json)</param>
        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Generates a signed JWT token for the specified user.
        /// </summary>
        /// <param name="user">The user for which the token should be created.</param>
        /// <returns>A signed JWT-token string</returns>
        /// <exception cref="Exception">Thrown if the JWT secret key is missing in the configuration.</exception>

        public string GenerateToken(AppUser user)
        {
            // Retrieve the secret key from configuration
            var keyString = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString))
            {
                throw new Exception("JWT secret key is missing in configuration!");
            }

            // Create a symmetric security key from the secret key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

            // Create signing credentials using the key and HMAC SHA256 algorithm
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Define the claims that describe the user.
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.UserName ?? "unknown"),
                new Claim("IsAdmin", user.IsAdmin.ToString())
            };

            // Create the JWT token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],       // Who issued the token
                audience: _configuration["Jwt:Audience"],   // Who the token is intended for
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),        // Token expiration time
                signingCredentials: credentials              // Digital signature
            );

            // return the token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
