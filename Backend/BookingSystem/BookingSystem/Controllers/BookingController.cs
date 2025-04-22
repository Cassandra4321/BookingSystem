using Microsoft.AspNetCore.Mvc;
using BookingSystem.API.Models;
using BookingSystem.API.Services;
using BookingSystem.API.Dtos;

namespace BookingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : Controller
    {
        private readonly BookingService _bookingService;

        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<BookingOutputDto>>> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            if (bookings == null || !bookings.Any())
            {
                return NotFound("No bookings found.");
            }
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookingOutputDto>> GetBookingById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound($"Booking with ID {id} not found.");
            }
            return Ok(booking);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Booking>> CreateBooking([FromBody] BookingInputDto bookingDto)
        {
            var createdBooking = await _bookingService.CreateBookingAsync(bookingDto);
            if (createdBooking == null)
            {
                return BadRequest("You have already booked this class.");
            }
            return CreatedAtAction(nameof(GetBookingById), new { id = createdBooking.Id }, createdBooking);
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<BookingOutputDto>>> GetBookingsForUser(string userId)
        {
            var bookings = await _bookingService.GetBookingForUserAsync(userId);
            if (bookings == null || !bookings.Any())
            {
                return NotFound($"No bookings found for user with ID {userId}.");
            }
            return Ok(bookings);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var deleted = await _bookingService.DeleteBookingAsync(id);
            if (!deleted)
            {
                return NotFound($"Booking with ID {id} not found.");
            }
            return Ok($"Booking with ID {id} deleted successfully.");
        }
    }
}
