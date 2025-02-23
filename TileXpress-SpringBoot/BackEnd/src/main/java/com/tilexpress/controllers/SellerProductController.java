package com.tilexpress.controllers;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Product;
import com.tilexpress.requests.ProductRequest;
import com.tilexpress.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller/product")
public class SellerProductController {

    ProductService productService;
    @Autowired
    public SellerProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/")
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest req) throws ProductException {

        Product product = null;
        try {
            product = productService.createProduct(req);
        } catch (ProductException e) {
            e.printStackTrace();
        }

        return new ResponseEntity<Product>(product, HttpStatus.ACCEPTED);
    }




}
