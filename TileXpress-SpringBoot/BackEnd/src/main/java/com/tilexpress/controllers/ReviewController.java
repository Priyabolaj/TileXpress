package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.Review;
import com.tilexpress.model.User;
import com.tilexpress.requests.ReviewRequest;
import com.tilexpress.services.ReviewService;
import com.tilexpress.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
	private UserService userService;
	private ReviewService reviewService;

	@Autowired
	public ReviewController(UserService userService, ReviewService reviewService) {
		this.userService = userService;
		this.reviewService = reviewService;
	}

	@PostMapping("/create")
	public ResponseEntity<Review> CreateReview(@RequestBody ReviewRequest request, @RequestHeader("Authorization") String jwt)throws UserException, ProductException {
		
		User user = userService.findUserProfileByJwt(jwt);
		
		Review review = reviewService.createReview(request, user);
		
		return new ResponseEntity<Review>(review,HttpStatus.CREATED);
	}
	
	@GetMapping("/product/{productId}")
	public ResponseEntity<List<Review>> getProductReview(@PathVariable Long productId) throws UserException,ProductException{
		
		List<Review> reviews = reviewService.getAllReview(productId);
		
		return new ResponseEntity<List<Review>>(reviews,HttpStatus.ACCEPTED);
	}
	
}
