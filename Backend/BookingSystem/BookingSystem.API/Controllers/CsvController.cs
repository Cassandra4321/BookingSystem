using BookingSystem.API.Services;
using Microsoft.AspNetCore.Mvc;

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

        /// <summary>
        /// Returns a CSV file containing the user's upcoming bookings.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <returns>A CSV file containing the upcoming bookings, or a 404 response if no bookings are found.</returns>

        [HttpGet("user/{userId}/upcoming")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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
