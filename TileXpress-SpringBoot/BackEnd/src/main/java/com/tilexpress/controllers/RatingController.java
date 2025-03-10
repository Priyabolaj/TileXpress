package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tilexpress.exceptions.ProductException;
import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.Rating;
import com.tilexpress.model.User;
import com.tilexpress.requests.RatingRequest;
import com.tilexpress.services.RatingService;
import com.tilexpress.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
	private UserService userService;
	private RatingService ratingService;

	@Autowired
	public RatingController(UserService userService, RatingService ratingService) {
		this.userService = userService;
		this.ratingService = ratingService;
	}

	@PostMapping("/create")
	public ResponseEntity<Rating> createRating(@RequestBody RatingRequest ratingRequest, @RequestHeader("Authorization") String jwt)throws UserException, ProductException {
		User user = userService.findUserProfileByJwt(jwt);
		System.out.println(ratingRequest);
		Rating rating = ratingService.createRating(ratingRequest, user);
		
		return new ResponseEntity<Rating>(rating,HttpStatus.CREATED);
	}
	
	@GetMapping("/product/{productId}")
	public ResponseEntity<List<Rating>> getProductRating(@PathVariable Long productId,@RequestHeader("Authorization") String jwt) throws UserException,ProductException{
		
		User user = userService.findUserProfileByJwt(jwt);
		
		List<Rating> rating = ratingService.getProductRating(productId);
		
		return new ResponseEntity<List<Rating>>(rating,HttpStatus.CREATED);
	}
}
