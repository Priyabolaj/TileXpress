using AutoMapper;
using TilesXpress.DTOs;
using TilesXpress.Models;
using TilesXpress.Repositories;
using TilesXpress.Services;

namespace TilesXpress.Services
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> _orderRepository;
        private readonly IGenericRepository<OrderItem> _orderItemRepository;
        private readonly ICartService _cartService;
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public OrderService(
            IGenericRepository<Order> orderRepository,
            IGenericRepository<OrderItem> orderItemRepository,
            ICartService cartService,
            IProductService productService,
            IMapper mapper)
        {
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _cartService = cartService;
            _productService = productService;
            _mapper = mapper;
        }

        public async Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetAllOrdersAsync()
        {
            try
            {
                var orders = await _orderRepository.GetAllWithIncludesAsync(
                    o => true, // Get all orders
                    "OrderItems",
                    "OrderItems.Product",
                    "User" // Include user information
                );

                var orderResponses = await Task.WhenAll(
                    orders.Select(async o => await CreateOrderResponseDto(o))
                );

                return ApiResponse<IEnumerable<OrderResponseDto>>.SuccessResponse(orderResponses);
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<OrderResponseDto>>.ErrorResponse(
                    "Error retrieving orders",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<OrderResponseDto>> CreateOrderFromCartAsync(int userId)
        {
            try
            {
                var cartResponse = await _cartService.GetCartByUserIdAsync(userId);
                if (!cartResponse.Success || cartResponse.Data?.Items == null || !cartResponse.Data.Items.Any())
                {
                    return ApiResponse<OrderResponseDto>.ErrorResponse("Cart is empty");
                }

                // Begin transaction
                decimal totalAmount = 0;
                var orderItems = new List<OrderItem>();

                foreach (var cartItem in cartResponse.Data.Items)
                {
                    var productResponse = await _productService.GetProductByIdAsync(cartItem.ProductId);
                    if (!productResponse.Success)
                    {
                        return ApiResponse<OrderResponseDto>.ErrorResponse(
                            $"Product not found: {cartItem.ProductId}"
                        );
                    }

                    if (productResponse.Data.Stock < cartItem.Quantity)
                    {
                        return ApiResponse<OrderResponseDto>.ErrorResponse(
                            $"Insufficient stock for product: {productResponse.Data.Name}",
                            new List<string> { $"Only {productResponse.Data.Stock} items available" }
                        );
                    }

                    var itemTotal = productResponse.Data.Price * cartItem.Quantity;
                    totalAmount += itemTotal;

                    orderItems.Add(new OrderItem
                    {
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                        Price = productResponse.Data.Price
                    });

                    // Update product stock
                    await _productService.UpdateStockAsync(cartItem.ProductId, -cartItem.Quantity);
                }

                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    TotalAmount = totalAmount
                };

                var createdOrder = await _orderRepository.AddAsync(order);

                foreach (var item in orderItems)
                {
                    item.OrderId = createdOrder.Id;
                    await _orderItemRepository.AddAsync(item);
                }

                // Clear the cart after successful order creation
                await _cartService.ClearCartAsync(userId);

                // Get complete order with items
                var completeOrder = await GetOrderByIdWithItemsAsync(createdOrder.Id);
                var orderResponse = await CreateOrderResponseDto(completeOrder);

                return ApiResponse<OrderResponseDto>.SuccessResponse(
                    orderResponse,
                    "Order created successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderResponseDto>.ErrorResponse(
                    "Error creating order",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<OrderResponseDto>> GetOrderByIdAsync(int orderId, int userId)
        {
            try
            {
                var order = await GetOrderByIdWithItemsAsync(orderId);
                if (order == null || order.UserId != userId)
                {
                    return ApiResponse<OrderResponseDto>.ErrorResponse("Order not found");
                }

                var orderResponse = await CreateOrderResponseDto(order);
                return ApiResponse<OrderResponseDto>.SuccessResponse(orderResponse);
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderResponseDto>.ErrorResponse(
                    "Error retrieving order",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<IEnumerable<OrderResponseDto>>> GetUserOrdersAsync(int userId)
        {
            try
            {
                var orders = await _orderRepository.GetAllWithIncludesAsync(
                    o => o.UserId == userId,
                    "OrderItems",
                    "OrderItems.Product"
                );

                var orderResponses = await Task.WhenAll(
                    orders.Select(async o => await CreateOrderResponseDto(o))
                );

                return ApiResponse<IEnumerable<OrderResponseDto>>.SuccessResponse(orderResponses);
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<OrderResponseDto>>.ErrorResponse(
                    "Error retrieving orders",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<OrderResponseDto>> UpdateOrderStatusAsync(
            int orderId,
            OrderStatusUpdateDto statusDto)
        {
            try
            {
                if (!OrderStatus.ValidStatuses.Contains(statusDto.Status))
                {
                    return ApiResponse<OrderResponseDto>.ErrorResponse(
                        "Invalid order status",
                        new List<string> { $"Valid statuses are: {string.Join(", ", OrderStatus.ValidStatuses)}" }
                    );
                }

                var order = await GetOrderByIdWithItemsAsync(orderId);
                if (order == null)
                {
                    return ApiResponse<OrderResponseDto>.ErrorResponse("Order not found");
                }

                order.Status = statusDto.Status;
                await _orderRepository.UpdateAsync(order);

                var orderResponse = await CreateOrderResponseDto(order);
                return ApiResponse<OrderResponseDto>.SuccessResponse(
                    orderResponse,
                    "Order status updated successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<OrderResponseDto>.ErrorResponse(
                    "Error updating order status",
                    new List<string> { ex.Message }
                );
            }
        }

        private async Task<Order> GetOrderByIdWithItemsAsync(int orderId)
        {
            var orders = await _orderRepository.GetAllWithIncludesAsync(
                o => o.Id == orderId,
                "OrderItems",
                "OrderItems.Product"
            );
            return orders.FirstOrDefault();
        }

        private async Task<OrderResponseDto> CreateOrderResponseDto(Order order)
        {
            var orderItems = order.OrderItems?.Select(item => new OrderItemResponseDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                Quantity = item.Quantity,
                UnitPrice = item.Price,
                Subtotal = item.Price * item.Quantity
            }).ToList() ?? new List<OrderItemResponseDto>();

            return new OrderResponseDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                Items = orderItems,
                UserName = order.User?.FirstName ?? "Unknown"
            };
        }
    }
}