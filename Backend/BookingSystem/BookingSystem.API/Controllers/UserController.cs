﻿using BookingSystem.API.Services;
using Microsoft.AspNetCore.Mvc;
using BookingSystem.API.Dtos;

namespace BookingSystem.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly RecommendationService _recommendationService;

        public UserController(RecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }

        [HttpGet("{userId}/recommendations")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<WorkoutClassDto>>> GetRecommendations(string userId)
        {
            var result = await _recommendationService.GetRecommendedClassesAsync(userId);
            return Ok(result);
        }
    }
}