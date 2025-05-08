using BookingSystem.API.Dtos;
using BookingSystem.API.Mappers;
using Microsoft.EntityFrameworkCore;
using BookingSystem.API.Data;
using System.Text;
namespace BookingSystem.API.Services
{
    public class CsvExportService
    {
        public byte[] GenerateBookingCsv(List<BookingOutputDto> bookings)
        {
            var csv = new StringBuilder();
            csv.AppendLine("Passnamn,Beskrivning,Starttid,Sluttid");

            foreach (var booking in bookings)
            {
                csv.AppendLine($"\"{booking.WorkoutClassName}\",\"{booking.Description}\",\"{booking.StartDate:yyyy-MM-dd HH:mm}\",\"{booking.EndDate:yyyy-MM-dd HH:mm}\"");
            }

            return Encoding.UTF8.GetBytes(csv.ToString());
        }
    }
}