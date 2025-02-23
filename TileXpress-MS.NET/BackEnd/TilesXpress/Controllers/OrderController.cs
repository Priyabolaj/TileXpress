using TilesXpress.DTOs;
using TilesXpress.Models;
using TilesXpress.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TilesXpress.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<IEnumerable<OrderResponseDto>>>> GetAllOrders()
        {
            var response = await _orderService.GetAllOrdersAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }
        [HttpPost("checkout")]
        public async Task<ActionResult<ApiResponse<OrderResponseDto>>> CreateOrder()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _orderService.CreateOrderFromCartAsync(userId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{orderId}")]
        public async Task<ActionResult<ApiResponse<OrderResponseDto>>> GetOrder(int orderId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _orderService.GetOrderByIdAsync(orderId, userId);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<OrderResponseDto>>>> GetUserOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _orderService.GetUserOrdersAsync(userId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<OrderResponseDto>>> UpdateOrderStatus(
            int orderId,
            OrderStatusUpdateDto statusDto)
        {
            var response = await _orderService.UpdateOrderStatusAsync(orderId, statusDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}