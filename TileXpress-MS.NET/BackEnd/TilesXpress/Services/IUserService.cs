using TilesXpress.DTOs;
using TilesXpress.Models;

namespace TilesXpress.Services
{
    public interface IUserService
    {
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(UserDto userDto);
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto);
        Task<ApiResponse<UserResponseDto>> GetUserByIdAsync(int userId);
        Task<ApiResponse<bool>> CheckEmailExistsAsync(string email);
    }
}
