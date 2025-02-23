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
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<CartResponseDto>>> GetCart()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _cartService.GetCartByUserIdAsync(userId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPost("items")]
        public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> AddItemToCart(CartItemDto cartItemDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _cartService.AddItemToCartAsync(userId, cartItemDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpPut("items/{productId}")]
        public async Task<ActionResult<ApiResponse<CartItemResponseDto>>> UpdateCartItemQuantity(
            int productId,
            UpdateCartItemDto updateDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _cartService.UpdateCartItemQuantityAsync(userId, productId, updateDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("items/{productId}")]
        public async Task<ActionResult<ApiResponse<bool>>> RemoveItemFromCart(int productId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _cartService.RemoveItemFromCartAsync(userId, productId);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpDelete]
        public async Task<ActionResult<ApiResponse<bool>>> ClearCart()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var response = await _cartService.ClearCartAsync(userId);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}