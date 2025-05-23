using BookingSystem.API.Dtos;
using System.Text;
namespace BookingSystem.API.Services
{
    /// <summary>
    ///  Service that generates CSV files based on bookings.
    /// </summary>
    public class CsvExportService
    {
        /// <summary>
        /// Generates a CSV file as a byte array from a list of bookings.
        /// </summary>
        /// <param name="bookings">The list of bookings.</param>
        /// <returns>The CSV file as a UTF-8 encoded byte array.</returns>
        public byte[] GenerateBookingCsv(List<BookingOutputDto> bookings)
        {
            var csv = new StringBuilder();
            csv.AppendLine("Passnamn,Beskrivning,Starttid,Sluttid");

            foreach (var booking in bookings)
            {
                // Quotation marks are used around each field to avoid CSV issues with special characters
                csv.AppendLine($"\"{booking.WorkoutClassName}\",\"{booking.Description}\",\"{booking.StartDate:yyyy-MM-dd HH:mm}\",\"{booking.EndDate:yyyy-MM-dd HH:mm}\"");
            }

            return Encoding.UTF8.GetBytes(csv.ToString());
        }
    }
}