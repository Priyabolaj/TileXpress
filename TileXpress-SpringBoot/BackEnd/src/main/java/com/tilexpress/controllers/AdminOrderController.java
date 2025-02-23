package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tilexpress.exceptions.OrderException;
import com.tilexpress.model.Order;
import com.tilexpress.responses.AdminOrdersAndUsers;
import com.tilexpress.responses.ApiResponse;
import com.tilexpress.services.OrderService;

import java.util.List;

@RestController
@RequestMapping("api/admin/orders")
public class AdminOrderController {

	@Autowired
	private OrderService orderService;

	@GetMapping("/")
	public ResponseEntity<List<Order>> getAllOrderHandler(){
		List<Order> orders = orderService.getAllOrders();
		return new ResponseEntity<List<Order>>(orders,HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/{orderId}/CONFIRMED")
	public ResponseEntity<Order> ConfirmedOrderHandler(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt)throws OrderException {
		
		Order order = orderService.confirmedOrder(orderId);
		return new ResponseEntity<Order>(order,HttpStatus.OK);
	}
	
	@PutMapping("/{orderId}/SHIPPED")
	public ResponseEntity<Order> shippedOrderHandler(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt)throws OrderException{
		
		Order order = orderService.shippedOrder(orderId);
		return new ResponseEntity<Order>(order,HttpStatus.OK);
	}
	
	@PutMapping("/{orderId}/DELIVERED")
	public ResponseEntity<Order> deliverOrderHandler(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt)throws OrderException{
		
		Order order = orderService.deliveredOrder(orderId);
		return new ResponseEntity<Order>(order,HttpStatus.OK);
	}
	
	@PutMapping("/{orderId}/CANCEL")
	public ResponseEntity<Order> cancelOrderHandler(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt)throws OrderException{
		
		Order order = orderService.cancledOrder(orderId);
		return new ResponseEntity<Order>(order,HttpStatus.OK);
	}
	
	@PutMapping("/{orderId}/delete")
	public ResponseEntity<ApiResponse> deleteOrderHandler(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt)throws OrderException{
		
		orderService.deleteOrder(orderId);
		
		ApiResponse apiResponse = new ApiResponse();
		apiResponse.setMessage("Order Deleted Successfully");
		apiResponse.setStatus(true);
		return new ResponseEntity<>(apiResponse,HttpStatus.OK);
	}


	
}
