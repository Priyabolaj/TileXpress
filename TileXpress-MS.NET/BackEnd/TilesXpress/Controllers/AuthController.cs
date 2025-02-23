using TilesXpress.DTOs;
using TilesXpress.Services;
using Microsoft.AspNetCore.Mvc;

namespace TilesXpress.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register(UserDto userDto)
        {
            var response = await _userService.RegisterAsync(userDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login(LoginDto loginDto)
        {
            var response = await _userService.LoginAsync(loginDto);
            return response.Success ? Ok(response) : Unauthorized(response);
        }

        [HttpGet("check-email")]
        public async Task<ActionResult<ApiResponse<bool>>> CheckEmail([FromQuery] string email)
        {
            var response = await _userService.CheckEmailExistsAsync(email);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}