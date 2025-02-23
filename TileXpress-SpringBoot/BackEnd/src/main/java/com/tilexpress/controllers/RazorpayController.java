package com.tilexpress.controllers;

import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.tilexpress.services.RazorpayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class RazorpayController {

    @Autowired
    private RazorpayService razorpayService;

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();
        try {
            int amount = (int) data.get("amount");
            Order order = razorpayService.createOrder(amount);

            response.put("success", true);
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
        } catch (RazorpayException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}