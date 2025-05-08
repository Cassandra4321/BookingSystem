using BookingSystem.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace BookingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CsvController : Controller
    {
        private readonly CsvExportService _csvExportService;
        private readonly BookingService _bookingService;

        public CsvController(CsvExportService csvExportService, BookingService bookingService)
        {
            _csvExportService = csvExportService;
            _bookingService = bookingService;
        }

        [HttpGet("user/{userId}/upcoming")]
        public async Task<IActionResult> DownloadUpcomingBookingsCSV(string userId)
        {
            var bookings = await _bookingService.GetOnlyUpcomingBookingsForUserAsync(userId);

            if (bookings == null || !bookings.Any())
            {
                return NotFound("Inga kommande bokningar hittades.");
            }

            var csvBytes = _csvExportService.GenerateBookingCsv(bookings);
            return File(csvBytes, "text/csv", $"kommande_bokningar.csv");
        }
    }
}
