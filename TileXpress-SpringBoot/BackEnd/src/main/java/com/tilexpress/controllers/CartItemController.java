package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tilexpress.exceptions.CartItemException;
import com.tilexpress.exceptions.ProductException;
import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.User;
import com.tilexpress.requests.AddItemRequest;
import com.tilexpress.responses.ApiResponse;
import com.tilexpress.services.CartItemService;
import com.tilexpress.services.UserService;

@RestController
@RequestMapping("/api/cart_item")
public class CartItemController {

    private CartItemService cartItemService;
    private UserService userService;

    @Autowired
    public CartItemController(CartItemService cartItemService, UserService userService) {
        this.cartItemService = cartItemService;
        this.userService = userService;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCartItem(@PathVariable Long id, @RequestHeader("Authorization") String jwt) throws UserException, ProductException, CartItemException {
        User user = userService.findUserProfileByJwt(jwt);

        cartItemService.removeCartItem(user.getId(), id);

        ApiResponse response = new ApiResponse();
        response.setMessage("Cart Item Removed Successfully");
        response.setStatus(true);

        return new ResponseEntity<ApiResponse>(response, HttpStatus.OK);
    }
    @PutMapping("/increment/{cartItemId}")
    public ResponseEntity<ApiResponse> incrementQuantity(@PathVariable Long cartItemId, @RequestHeader("Authorization") String jwt) throws UserException, ProductException, CartItemException {
        userService.findUserProfileByJwt(jwt);

        String res = cartItemService.incrementQuantity(cartItemId);

        ApiResponse response = new ApiResponse();
        response.setMessage(res);
        response.setStatus(true);

        return new ResponseEntity<ApiResponse>(response,HttpStatus.OK);
    }

    @PutMapping("/decrement/{cartItemId}")
    public ResponseEntity<ApiResponse> decrementQuantity(@PathVariable Long cartItemId, @RequestHeader("Authorization") String jwt) throws UserException, ProductException, CartItemException {
        userService.findUserProfileByJwt(jwt);

        String res = cartItemService.decrementQuantity(cartItemId);

        ApiResponse response = new ApiResponse();
        response.setMessage(res);
        response.setStatus(true);

        return new ResponseEntity<ApiResponse>(response,HttpStatus.OK);
    }

}
