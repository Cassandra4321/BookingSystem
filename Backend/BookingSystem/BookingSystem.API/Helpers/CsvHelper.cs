using BookingSystem.API.Dtos;
using System.Text;

namespace BookingSystem.API.Helpers
{
    public static class CsvHelper
    {
        public static string GenerateCsv(List<BookingOutputDto> bookings)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Passnamn,Beskrivning,Starttid,Sluttid");

            foreach (var booking in bookings)
            {
                sb.AppendLine($"{EscapeCsv(booking.WorkoutClassName)},{EscapeCsv(booking.Description)},{booking.StartDate:yyyy-MM-dd HH:mm},{booking.EndDate:yyyy-MM-dd HH:mm}");
            }

            return sb.ToString();
        }

        public static string EscapeCsv(string input)
        {
            if (input.Contains(",") || input.Contains("\"") || input.Contains("\n"))
            {
                input = input.Replace("\"", "\"\"");
                return $"\"{input}\"";
            }

            return input;
        }
    }

}
