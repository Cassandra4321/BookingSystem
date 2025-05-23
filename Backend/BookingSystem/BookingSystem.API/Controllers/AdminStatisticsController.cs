using BookingSystem.API.Dtos;
using BookingSystem.API.Services;
using Microsoft.AspNetCore.Mvc;


namespace BookingSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminStatisticsController : Controller
    {
        private readonly AdminStatisticsService _statisticsService;

        public AdminStatisticsController(AdminStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [HttpGet]
        public async Task<ActionResult<AdminStatsDtos>> GetStatisticsAsync()
        {
            var stats = await _statisticsService.GetStatisticsAsync();
            return Ok(stats);

        }
    }
}
