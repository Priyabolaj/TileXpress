package com.tilexpress.services;

import org.springframework.data.domain.Page;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Product;
import com.tilexpress.requests.ProductRequest;
import com.tilexpress.requests.ProductUpdateRequest;

import java.util.List;

public interface ProductService {
    public Product createProduct(ProductRequest req) throws ProductException;
    public String deleteProduct(Long productId) throws ProductException;

    public Product updateProduct(Long productId, ProductUpdateRequest product) throws ProductException;

    public Product findProductById(Long productId) throws ProductException;

    public List<Product> findProductByCategory(Long categoryId) throws ProductException;
    public Page<Product> getAllProduct(String category, List<String> colors,List<String> sizes, Integer minPrice, Integer maxPrice, Integer minDiscount, String sort,String stock, Integer pageNumber, Integer pageSize)throws ProductException;
    public List<Product> findAllProducts() throws ProductException;
}
