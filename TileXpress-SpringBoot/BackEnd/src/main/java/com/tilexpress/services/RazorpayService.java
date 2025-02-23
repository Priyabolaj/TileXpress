package com.tilexpress.services;

import com.razorpay.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    @Value("${razorpay.api.key}")
    private String razorpayKeyId;

    @Value("${razorpay.api.secret}")
    private String razorpayKeySecret;

    public Order createOrder(int amount) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // Convert INR to paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_123456");
        orderRequest.put("payment_capture", 1);

        return razorpayClient.orders.create(orderRequest);
    }
}