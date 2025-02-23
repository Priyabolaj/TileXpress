using AutoMapper;
using TilesXpress.DTOs;
using TilesXpress.Enties;
using TilesXpress.Models;
using TilesXpress.Repositories;
using TilesXpress.Services;


namespace TilesXpress.Services
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IJwtService _jwtService;
        private readonly IMapper _mapper;

        public UserService(
            IGenericRepository<User> userRepository,
            IJwtService jwtService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _mapper = mapper;
        }

        public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(UserDto userDto)
        {
            try
            {
                // Validate email uniqueness
                var emailExists = await CheckEmailExistsAsync(userDto.Email);
                if (emailExists.Data)
                {
                    return ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Registration failed",
                        new List<string> { "Email already exists" }
                    );
                }

                // Validate role
                if (!string.IsNullOrEmpty(userDto.Role) && !UserRoles.ValidRoles.Contains(userDto.Role))
                {
                    return ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Invalid role",
                        new List<string> { $"Valid roles are: {string.Join(", ", UserRoles.ValidRoles)}" }
                    );
                }

                var user = _mapper.Map<User>(userDto);
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
                user.Role = string.IsNullOrEmpty(userDto.Role) ? UserRoles.User : userDto.Role;

                var createdUser = await _userRepository.AddAsync(user);
                var token = _jwtService.GenerateToken(createdUser);
                var userResponse = _mapper.Map<UserResponseDto>(createdUser);

                return ApiResponse<AuthResponseDto>.SuccessResponse(
                    new AuthResponseDto { Token = token, User = userResponse },
                    "Registration successful"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Registration failed",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                var user = users.FirstOrDefault(u => u.Email.ToLower() == loginDto.Email.ToLower());

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return ApiResponse<AuthResponseDto>.ErrorResponse(
                        "Login failed",
                        new List<string> { "Invalid email or password" }
                    );
                }

                var token = _jwtService.GenerateToken(user);
                var userResponse = _mapper.Map<UserResponseDto>(user);

                return ApiResponse<AuthResponseDto>.SuccessResponse(
                    new AuthResponseDto { Token = token, User = userResponse },
                    "Login successful"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<AuthResponseDto>.ErrorResponse(
                    "Login failed",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<UserResponseDto>> GetUserByIdAsync(int userId)
        {
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return ApiResponse<UserResponseDto>.ErrorResponse("User not found");
                }

                var userResponse = _mapper.Map<UserResponseDto>(user);
                return ApiResponse<UserResponseDto>.SuccessResponse(userResponse);
            }
            catch (Exception ex)
            {
                return ApiResponse<UserResponseDto>.ErrorResponse(
                    "Error retrieving user",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> CheckEmailExistsAsync(string email)
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                var exists = users.Any(u => u.Email.ToLower() == email.ToLower());
                return ApiResponse<bool>.SuccessResponse(exists);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Error checking email",
                    new List<string> { ex.Message }
                );
            }
        }
    }
}