package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Product;
import com.tilexpress.services.ProductService;

import java.util.List;

@RestController
@RequestMapping("/")
public class ProductController {

	@Autowired
	private ProductService productService;

	@GetMapping("/products")
	public ResponseEntity<Page<Product>> findProductByCategory(@RequestParam String category,
															   @RequestParam List<String> color,
															   @RequestParam List<String> size,
															   @RequestParam(required = false) Integer minPrice,
															   @RequestParam(required = false) Integer maxPrice,
															   @RequestParam(required = false) Integer minDiscount,
															   @RequestParam String sort,
															   @RequestParam String stock,
															   @RequestParam Integer pagenumber,
															   @RequestParam Integer pageSize) throws ProductException {

		Page<Product> productPage = productService.getAllProduct(category, color, size, minPrice, maxPrice, minDiscount, sort, stock, pagenumber, pageSize);

		return new ResponseEntity<>(productPage, HttpStatus.ACCEPTED);
	}





	@GetMapping("products/{productId}")
	public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId)throws ProductException{
		
		Product product = productService.findProductById(productId);
		
		return new ResponseEntity<Product>(product,HttpStatus.ACCEPTED);
	}

	@GetMapping("/api/products/all")
	public ResponseEntity<List<Product>> findAllProducts()throws ProductException{
		List<Product> products = productService.findAllProducts();
		return new ResponseEntity<>(products,HttpStatus.OK);
	}
}
