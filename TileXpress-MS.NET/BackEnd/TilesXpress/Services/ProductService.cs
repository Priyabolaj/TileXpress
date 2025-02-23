using AutoMapper;
using TilesXpress.DTOs;
using TilesXpress.Models;
using TilesXpress.Repositories;

namespace TilesXpress.Services
{
   

    public class ProductService : IProductService
    {
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IMapper _mapper;

        public ProductService(
            IGenericRepository<Product> productRepository,
            IGenericRepository<Category> categoryRepository,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<IEnumerable<ProductResponseDto>>> GetAllProductsAsync()
        {
            try
            {
                var products = await _productRepository.GetAllWithIncludesAsync(
                    p => true,
                    "Category"
                );
                var productDtos = _mapper.Map<IEnumerable<ProductResponseDto>>(products);
                return ApiResponse<IEnumerable<ProductResponseDto>>.SuccessResponse(productDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<ProductResponseDto>>.ErrorResponse(
                    "Error retrieving products",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<ProductResponseDto>> GetProductByIdAsync(int id)
        {
            try
            {
                var product = await _productRepository.GetByIdWithIncludesAsync(id, "Category");
                if (product == null)
                {
                    return ApiResponse<ProductResponseDto>.ErrorResponse(
                        $"Product with ID {id} not found"
                    );
                }

                var productDto = _mapper.Map<ProductResponseDto>(product);
                return ApiResponse<ProductResponseDto>.SuccessResponse(productDto);
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductResponseDto>.ErrorResponse(
                    "Error retrieving product",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<ProductResponseDto>> CreateProductAsync(ProductDto productDto)
        {
            try
            {
                var validationErrors = ValidateProduct(productDto);
                if (validationErrors.Any())
                {
                    return ApiResponse<ProductResponseDto>.ErrorResponse(
                        "Validation failed",
                        validationErrors
                    );
                }

                var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
                if (category == null)
                {
                    return ApiResponse<ProductResponseDto>.ErrorResponse(
                        $"Category with ID {productDto.CategoryId} not found"
                    );
                }

                var product = _mapper.Map<Product>(productDto);
                var createdProduct = await _productRepository.AddAsync(product);
                var responseDto = _mapper.Map<ProductResponseDto>(createdProduct);
                responseDto.CategoryName = category.Name;

                return ApiResponse<ProductResponseDto>.SuccessResponse(
                    responseDto,
                    "Product created successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductResponseDto>.ErrorResponse(
                    "Error creating product",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<ProductResponseDto>> UpdateProductAsync(
            int id,
            ProductDto productDto
        )
        {
            try
            {
                var existingProduct = await _productRepository.GetByIdWithIncludesAsync(id, "Category");
                if (existingProduct == null)
                {
                    return ApiResponse<ProductResponseDto>.ErrorResponse(
                        $"Product with ID {id} not found"
                    );
                }

                var validationErrors = ValidateProduct(productDto);
                if (validationErrors.Any())
                {
                    return ApiResponse<ProductResponseDto>.ErrorResponse(
                        "Validation failed",
                        validationErrors
                    );
                }

                var category = await _categoryRepository.GetByIdAsync(productDto.CategoryId);
                if (category == null)
                {
                    return ApiResponse<ProductResponseDto>.ErrorResponse(
                        $"Category with ID {productDto.CategoryId} not found"
                    );
                }

                _mapper.Map(productDto, existingProduct);
                await _productRepository.UpdateAsync(existingProduct);

                var responseDto = _mapper.Map<ProductResponseDto>(existingProduct);
                responseDto.CategoryName = category.Name;

                return ApiResponse<ProductResponseDto>.SuccessResponse(
                    responseDto,
                    "Product updated successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductResponseDto>.ErrorResponse(
                    "Error updating product",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(id);
                if (product == null)
                {
                    return ApiResponse<bool>.ErrorResponse($"Product with ID {id} not found");
                }

                await _productRepository.DeleteAsync(product);
                return ApiResponse<bool>.SuccessResponse(true, "Product deleted successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Error deleting product",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<IEnumerable<ProductResponseDto>>> GetProductsByCategoryAsync(
            int categoryId
        )
        {
            try
            {
                var products = await _productRepository.GetAllWithIncludesAsync(
                    p => p.CategoryId == categoryId,
                    "Category"
                );
                var productDtos = _mapper.Map<IEnumerable<ProductResponseDto>>(products);
                return ApiResponse<IEnumerable<ProductResponseDto>>.SuccessResponse(productDtos);
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<ProductResponseDto>>.ErrorResponse(
                    "Error retrieving products",
                    new List<string> { ex.Message }
                );
            }
        }

        public async Task<ApiResponse<bool>> UpdateStockAsync(int id, int quantity)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(id);
                if (product == null)
                {
                    return ApiResponse<bool>.ErrorResponse($"Product with ID {id} not found");
                }

                if (product.Stock + quantity < 0)
                {
                    return ApiResponse<bool>.ErrorResponse(
                        "Insufficient stock",
                        new List<string> { "Cannot reduce stock below 0" }
                    );
                }

                product.Stock += quantity;
                await _productRepository.UpdateAsync(product);
                return ApiResponse<bool>.SuccessResponse(
                    true,
                    "Stock updated successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Error updating stock",
                    new List<string> { ex.Message }
                );
            }
        }

        private List<string> ValidateProduct(ProductDto productDto)
        {
            var errors = new List<string>();

            if (string.IsNullOrEmpty(productDto.Name))
            {
                errors.Add("Product name is required");
            }

            if (productDto.Price < 0)
            {
                errors.Add("Price cannot be negative");
            }

            if (productDto.Stock < 0)
            {
                errors.Add("Stock cannot be negative");
            }

            if (string.IsNullOrEmpty(productDto.ImageUrl))
            {
                errors.Add("Image URL is required");
            }

            return errors;
        }
    }
}