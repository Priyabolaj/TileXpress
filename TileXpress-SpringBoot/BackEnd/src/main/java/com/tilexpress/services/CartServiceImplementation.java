package com.tilexpress.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.*;
import com.tilexpress.repositories.CartItemRepository;
import com.tilexpress.repositories.CartRepository;
import com.tilexpress.requests.AddItemRequest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Service
public class CartServiceImplementation implements CartService{

	private CartRepository cartRepository;
	private CartItemService cartItemService;
	private ProductService productService;

	private CartItemRepository cartItemRepository;
	
	
	@Autowired
	public CartServiceImplementation(CartRepository cartRepository, CartItemService cartItemService,ProductService productService, CartItemRepository cartItemRepository) {
		this.cartRepository = cartRepository;
		this.cartItemService = cartItemService;
		this.productService = productService;
		this.cartItemRepository = cartItemRepository;
	}

	@Override
	public Cart CreateCart(User user) {
		Cart cart = new Cart();
		cart.setUser(user);
		return cartRepository.save(cart);
	}

	@Override
	public String addCartItem(Long userId, AddItemRequest req) throws ProductException {
		Cart cart = cartRepository.findByUserId(userId);
		Product product = productService.findProductById(req.getProductId());

		CartItems isPresent = cartItemService.isCartItemExist(cart, product, req.getSize(), userId);

		if (isPresent==null) {
			CartItems cartItem = new CartItems();
			cartItem.setProduct(product);
			cartItem.setCart(cart);
			cartItem.setQuantity(req.getQuantity());
			cartItem.setUserId(userId);

			Integer price = req.getQuantity()*product.getPrice();
			cartItem.setPrice(price);
			cartItem.setSize(req.getSize());
			cartItem.setDiscountedPrice(cartItem.getProduct().getDiscountedPrice()*cartItem.getQuantity());
			cartItemRepository.save(cartItem);
			cart.getCartItems().add(cartItem);
			cart.setDiscount(price-cartItem.getDiscountedPrice());
			return "Item Add To Cart";
		}else{
			Integer price = req.getQuantity()*product.getPrice();
			isPresent.setPrice(isPresent.getPrice()+price);
			isPresent.setDiscountedPrice(isPresent.getDiscountedPrice()+isPresent.getProduct().getDiscountedPrice()*isPresent.getQuantity());
			isPresent.setQuantity(isPresent.getQuantity()+req.getQuantity());
			cartItemRepository.save(isPresent);
			return "Item Updated To Cart";
		}

	}

	@Override
	public Cart findUserCart(Long userId) {
		Cart cart = cartRepository.findByUserId(userId);

		Integer totalPrice=0;
		Integer totalDiscountedPrice=0;
		Integer totalItems=0;

		for(CartItems cartItem: cart.getCartItems()) {
			totalPrice += cartItem.getPrice();
			totalDiscountedPrice += cartItem.getDiscountedPrice();
			totalItems+=1;
		}

		cart.setTotalDiscountedPrice(totalDiscountedPrice);
		cart.setTotalItem(totalItems);
		cart.setDiscount(totalPrice-totalDiscountedPrice);
		cart.setTotalPrice(totalPrice);

		return cartRepository.save(cart);
	}
}
