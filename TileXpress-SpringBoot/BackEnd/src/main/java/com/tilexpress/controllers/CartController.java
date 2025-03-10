package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.Cart;
import com.tilexpress.model.CartItems;
import com.tilexpress.model.User;
import com.tilexpress.requests.AddItemRequest;
import com.tilexpress.responses.ApiResponse;
import com.tilexpress.services.CartService;
import com.tilexpress.services.UserService;

import java.util.*;

@RequestMapping("/api/cart")
@RestController
public class CartController {

	private CartService cartService;
	private UserService userService;

	@Autowired
	public CartController(CartService cartService, UserService userService) {
		this.cartService = cartService;
		this.userService = userService;
	}

	@GetMapping("/")
	public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String jwt) throws UserException {
		User user = userService.findUserProfileByJwt(jwt);
		Cart cart = cartService.findUserCart(user.getId());

		Set<CartItems> sortedCartItemsSet = new TreeSet<>(new Comparator<CartItems>() {
			@Override
			public int compare(CartItems item1, CartItems item2) {
				return Long.compare(item1.getId(), item2.getId());
			}
		});
		sortedCartItemsSet.addAll(cart.getCartItems());
		cart.setCartItems(sortedCartItemsSet);
		return new ResponseEntity<Cart>(cart, HttpStatus.OK);
	}

	
	@PutMapping("/add")
	public ResponseEntity<ApiResponse> addItemToCart(@RequestBody AddItemRequest request, @RequestHeader("Authorization") String jwt)throws UserException , ProductException {
		User user = userService.findUserProfileByJwt(jwt);
		
		String res = cartService.addCartItem(user.getId(), request);
		
		ApiResponse response = new ApiResponse();
		response.setMessage(res);
		response.setStatus(true);
		
		return new ResponseEntity<ApiResponse>(response,HttpStatus.OK);
	}


}
