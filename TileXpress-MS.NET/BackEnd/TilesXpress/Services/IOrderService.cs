using TilesXpress.DTOs;
using TilesXpress.Models;

namespace TilesXpress.Services
{
    public interface IOrderService
    {
        Task<ApiResponse<OrderResponseDto>> CreateOrderFromCartAsync(int userId);
        Task<ApiResponse<OrderResponseDto>> GetOrderByIdAsync(int orderId, int userId);
        Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetUserOrdersAsync(int userId);
        Task<ApiResponse<OrderResponseDto>> UpdateOrderStatusAsync(int orderId, OrderStatusUpdateDto statusDto);

        Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetAllOrdersAsync();
    }
}
