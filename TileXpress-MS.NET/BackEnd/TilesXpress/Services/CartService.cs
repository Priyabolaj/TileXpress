using AutoMapper;
using TilesXpress.DTOs;
using TilesXpress.Models;
using TilesXpress.Repositories;
using TilesXpress.Services;

namespace TilesXpress.Services
{

    public class CartService : ICartService
    {
        private readonly IGenericRepository<Cart> _cartRepository;
        private readonly IGenericRepository<CartItem> _cartItemRepository;
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IMapper _mapper;

        public CartService(
            IGenericRepository<Cart> cartRepository,
            IGenericRepository<CartItem> cartItemRepository,
            IGenericRepository<Product> productRepository,
            IMapper mapper)
        {
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<CartResponseDto>> GetCartByUserIdAsync(int userId)
        {
            try
            {
                var cart = await GetOrCreateCartAsync(userId);
                var cartResponse = await CreateCartResponseDto(cart);
                return ApiResponse<CartResponseDto>.SuccessResponse(cartResponse);
            }
            catch (Exception ex)
            {
                return ApiResponse<CartResponseDto>.ErrorResponse(
                    "Error retrieving cart",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<CartItemResponseDto>> AddItemToCartAsync(int userId, CartItemDto cartItemDto)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(cartItemDto.ProductId);
                if (product == null)
                {
                    return ApiResponse<CartItemResponseDto>.ErrorResponse(
                        $"Product with ID {cartItemDto.ProductId} not found"
                    );
                }

                if (product.Stock < cartItemDto.Quantity)
                {
                    return ApiResponse<CartItemResponseDto>.ErrorResponse(
                        "Insufficient stock",
                        new List<string> { $"Only {product.Stock} items available" }
                    );
                }

                var cart = await GetOrCreateCartAsync(userId);

                var existingItem = cart.CartItems?.FirstOrDefault(ci => ci.ProductId == cartItemDto.ProductId);
                if (existingItem != null)
                {
                    var newQuantity = existingItem.Quantity + cartItemDto.Quantity;
                    if (product.Stock < newQuantity)
                    {
                        return ApiResponse<CartItemResponseDto>.ErrorResponse(
                            "Insufficient stock",
                            new List<string> { $"Cannot add {cartItemDto.Quantity} more items. Only {product.Stock - existingItem.Quantity} additional items available" }
                        );
                    }

                    existingItem.Quantity = newQuantity;
                    await _cartItemRepository.UpdateAsync(existingItem);
                    var updatedItemResponse = await CreateCartItemResponseDto(existingItem);
                    return ApiResponse<CartItemResponseDto>.SuccessResponse(updatedItemResponse, "Cart item quantity updated");
                }

                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = cartItemDto.ProductId,
                    Quantity = cartItemDto.Quantity
                };

                var addedItem = await _cartItemRepository.AddAsync(cartItem);
                var itemResponse = await CreateCartItemResponseDto(addedItem);
                return ApiResponse<CartItemResponseDto>.SuccessResponse(itemResponse, "Item added to cart");
            }
            catch (Exception ex)
            {
                return ApiResponse<CartItemResponseDto>.ErrorResponse(
                    "Error adding item to cart",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<CartItemResponseDto>> UpdateCartItemQuantityAsync(
            int userId,
            int productId,
            UpdateCartItemDto updateDto)
        {
            try
            {
                var cart = await GetOrCreateCartAsync(userId);
                var cartItem = cart.CartItems?.FirstOrDefault(ci => ci.ProductId == productId);

                if (cartItem == null)
                {
                    return ApiResponse<CartItemResponseDto>.ErrorResponse("Cart item not found");
                }

                var product = await _productRepository.GetByIdAsync(productId);
                if (product.Stock < updateDto.Quantity)
                {
                    return ApiResponse<CartItemResponseDto>.ErrorResponse(
                        "Insufficient stock",
                        new List<string> { $"Only {product.Stock} items available" }
                    );
                }

                cartItem.Quantity = updateDto.Quantity;
                await _cartItemRepository.UpdateAsync(cartItem);

                var itemResponse = await CreateCartItemResponseDto(cartItem);
                return ApiResponse<CartItemResponseDto>.SuccessResponse(itemResponse, "Cart item quantity updated");
            }
            catch (Exception ex)
            {
                return ApiResponse<CartItemResponseDto>.ErrorResponse(
                    "Error updating cart item",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> RemoveItemFromCartAsync(int userId, int productId)
        {
            try
            {
                var cart = await GetOrCreateCartAsync(userId);
                var cartItem = cart.CartItems?.FirstOrDefault(ci => ci.ProductId == productId);

                if (cartItem == null)
                {
                    return ApiResponse<bool>.ErrorResponse("Cart item not found");
                }

                await _cartItemRepository.DeleteAsync(cartItem);
                return ApiResponse<bool>.SuccessResponse(true, "Item removed from cart");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Error removing item from cart",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> ClearCartAsync(int userId)
        {
            try
            {
                var cart = await GetOrCreateCartAsync(userId);
                if (cart.CartItems?.Any() == true)
                {
                    foreach (var item in cart.CartItems)
                    {
                        await _cartItemRepository.DeleteAsync(item);
                    }
                }
                return ApiResponse<bool>.SuccessResponse(true, "Cart cleared successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Error clearing cart",
                    new List<string> { ex.Message }
                );
            }
        }

        private async Task<Cart> GetOrCreateCartAsync(int userId)
        {
            var cart = (await _cartRepository.GetAllWithIncludesAsync(
                c => c.UserId == userId,
                "CartItems",
                "CartItems.Product"
            )).FirstOrDefault();

            if (cart == null)
            {
                cart = await _cartRepository.AddAsync(new Cart { UserId = userId });
            }

            return cart;
        }

        private async Task<CartResponseDto> CreateCartResponseDto(Cart cart)
        {
            var cartItems = cart.CartItems?.ToList() ?? new List<CartItem>();
            var cartItemResponses = new List<CartItemResponseDto>();

            foreach (var item in cartItems)
            {
                cartItemResponses.Add(await CreateCartItemResponseDto(item));
            }

            return new CartResponseDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cartItemResponses,
                TotalAmount = cartItemResponses.Sum(i => i.Subtotal),
                TotalItems = cartItemResponses.Sum(i => i.Quantity)
            };
        }

        private async Task<CartItemResponseDto> CreateCartItemResponseDto(CartItem cartItem)
        {
            var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
            return new CartItemResponseDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = product.Name,
                ProductPrice = product.Price,
                Quantity = cartItem.Quantity,
                Subtotal = product.Price * cartItem.Quantity,
                AvailableStock = product.Stock
            };
        }
    }
}