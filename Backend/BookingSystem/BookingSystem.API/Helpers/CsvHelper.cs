using BookingSystem.API.Dtos;
using System.Text;

namespace BookingSystem.API.Helpers
{
    public static class CsvHelper
    {
        /// <summary>
        /// Generates a CSV-formatted string from a list of bookings.
        /// </summary>
        /// <param name="bookings">The list of bookings to export.</param>
        /// <returns>A CSV-formatted string.</returns>
        public static string GenerateCsv(List<BookingOutputDto> bookings)
        {
            var sb = new StringBuilder();
            sb.AppendLine("Passnamn,Beskrivning,Starttid,Sluttid");

            foreach (var booking in bookings)
            {
                // Escape is used to ensure proper formatting of special characters
                sb.AppendLine($"{EscapeCsv(booking.WorkoutClassName)},{EscapeCsv(booking.LongDescription)},{booking.StartDate:yyyy-MM-dd HH:mm},{booking.EndDate:yyyy-MM-dd HH:mm}");
            }

            return sb.ToString();
        }

        /// <summary>
        /// Escapes special characters according to the CSV standard.
        /// If the field contains commas, quotation marks, or line breaks, it is enclosed in double quotes.
        /// Double quotes (") within the field are replaced with two double quotes ("").
        /// </summary>
        /// <param name="input">The string to be escaped.</param>
        /// <returns>A properly escaped CSV string.</returns>
        public static string EscapeCsv(string input)
        {
            if (input.Contains(",") || input.Contains("\"") || input.Contains("\n"))
            {
                input = input.Replace("\"", "\"\"");  // Double quotes in CSV must be doubled
                return $"\"{input}\"";
            }

            return input;
        }
    }

}
