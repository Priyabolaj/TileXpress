package com.tilexpress.services;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Cart;
import com.tilexpress.model.User;
import com.tilexpress.requests.AddItemRequest;

public interface CartService {

public Cart CreateCart(User user);
	
	public String addCartItem(Long userId, AddItemRequest req)throws ProductException;
	
	public Cart findUserCart(Long userId);


}
