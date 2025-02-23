package com.tilexpress.services;


import java.util.List;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Rating;
import com.tilexpress.model.User;
import com.tilexpress.requests.RatingRequest;

public interface RatingService {

	public Rating createRating(RatingRequest req, User user)throws ProductException;
	
	public List<Rating> getProductRating(Long productId);
}
