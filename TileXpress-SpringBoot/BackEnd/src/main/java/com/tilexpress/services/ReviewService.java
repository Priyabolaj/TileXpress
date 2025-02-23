package com.tilexpress.services;


import java.util.List;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Review;
import com.tilexpress.model.User;
import com.tilexpress.requests.ReviewRequest;

public interface ReviewService {

	public Review createReview(ReviewRequest req, User user)throws ProductException;
	
	public List<Review> getAllReview(Long productId);
}
