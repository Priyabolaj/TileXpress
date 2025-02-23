package com.tilexpress.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.model.Product;
import com.tilexpress.model.Rating;
import com.tilexpress.model.User;
import com.tilexpress.repositories.RatingRepository;
import com.tilexpress.requests.RatingRequest;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingServiceImplemetation implements RatingService {

	private RatingRepository ratingRepository;
	private ProductService productService;
	
	
	@Autowired
	public RatingServiceImplemetation(RatingRepository ratingRepository, ProductService productService) {
		super();
		this.ratingRepository = ratingRepository;
		this.productService = productService;
	}

	@Override
	public Rating createRating(RatingRequest req, User user) throws ProductException {
		Product product = productService.findProductById(req.getProductId());
		
		Rating rating = new Rating();
		rating.setProduct(product);
		rating.setUser(user);
		rating.setRating(req.getRating());
		rating.setCreatedAt(LocalDateTime.now());
		return ratingRepository.save(rating);
	}

	@Override
	public List<Rating> getProductRating(Long productId) {
		
		return ratingRepository.getAllProductRating(productId);
	}

}
