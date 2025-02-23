package com.tilexpress.services;


import java.util.List;

import com.tilexpress.exceptions.CartItemException;
import com.tilexpress.exceptions.ProductException;
import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.Cart;
import com.tilexpress.model.CartItems;
import com.tilexpress.model.Product;

public interface CartItemService {

	public String incrementQuantity(Long cartItemId)throws CartItemException, ProductException;
	public String decrementQuantity(Long cartItemId)throws CartItemException,ProductException;
	
	public CartItems isCartItemExist(Cart cart, Product product, String size, Long userId);
	
	public void removeCartItem(Long userId, Long cartItemId)throws CartItemException, UserException;
	
	public CartItems findCartItemById(Long cartItemId) throws CartItemException;

	public void updateProductsQuantity(Long userId)throws ProductException;
}
