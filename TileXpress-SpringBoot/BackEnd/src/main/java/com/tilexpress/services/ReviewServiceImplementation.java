package com.tilexpress.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Product;
import com.tilexpress.model.Review;
import com.tilexpress.model.User;
import com.tilexpress.repositories.ReviewRepository;
import com.tilexpress.requests.ReviewRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImplementation implements ReviewService{

	private ReviewRepository reviewRepository;
	private ProductService productService;
	
	
	@Autowired
	public ReviewServiceImplementation(ReviewRepository reviewRepository, ProductService productService) {
		this.reviewRepository = reviewRepository;
		this.productService = productService;
	}

	@Override
	public Review createReview(ReviewRequest req, User user) throws ProductException {
		Product product = productService.findProductById(req.getProductId());
		
		Review review = new Review();
		review.setUser(user);
		review.setProduct(product);
		review.setReview(req.getReview());
		review.setCreatedAt(LocalDateTime.now());
		return reviewRepository.save(review);
	}

	@Override
	public List<Review> getAllReview(Long productId) {
		
		return reviewRepository.getAllProductReview(productId);
	}

}
