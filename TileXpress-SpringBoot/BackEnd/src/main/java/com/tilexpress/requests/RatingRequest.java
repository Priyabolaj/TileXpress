package com.tilexpress.requests;

public class RatingRequest {

	private Long productId;
	private Double rating;
	public RatingRequest() {
		super();
	}
	public RatingRequest(Long productId, Double rating) {
		super();
		this.productId = productId;
		this.rating = rating;
	}
	public Long getProductId() {
		return productId;
	}
	public void setProductId(Long productId) {
		this.productId = productId;
	}
	public Double getRating() {
		return rating;
	}
	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	
}
