namespace BookingSystem.API.Models
{
    public class LoginResult
    {
        public string? Token { get; set; }
        public bool Success { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool IsAdmin { get; set; }
    }
}
