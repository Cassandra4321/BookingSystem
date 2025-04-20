namespace BookingSystem.API.Dtos
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public bool IsAdmin { get; set; }
    }
}
