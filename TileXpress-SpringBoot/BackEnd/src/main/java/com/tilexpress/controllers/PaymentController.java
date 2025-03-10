package com.tilexpress.controllers;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.tilexpress.exceptions.OrderException;
import com.tilexpress.exceptions.ProductException;
import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.Address;
import com.tilexpress.model.Cart;
import com.tilexpress.model.Order;
import com.tilexpress.model.User;
import com.tilexpress.repositories.CartItemRepository;
import com.tilexpress.repositories.CartRepository;
import com.tilexpress.repositories.OrderRepository;
import com.tilexpress.responses.ApiResponse;
import com.tilexpress.responses.PaymentResponse;
import com.tilexpress.services.*;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Value("${razorpay.api.key}")
    String apiKey;
    @Value("${razorpay.api.secret}")
    String apiSecret;
    private OrderService orderService;
    private UserService userService;
    private OrderRepository orderRepository;
    private EmailService emailService;
    private CartRepository cartRepository;
    private CartItemService cartItemService;
    private CartService cartService;
    private CartItemRepository cartItemRepository;

    @Autowired
    public PaymentController( OrderService orderService, UserService userService, OrderRepository orderRepository, EmailService emailService, CartRepository cartRepository, CartItemService cartItemService, CartService cartService, CartItemRepository cartItemRepository) {
        this.orderService = orderService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.emailService = emailService;
        this.cartRepository = cartRepository;
        this.cartItemService = cartItemService;
        this.cartService = cartService;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    @PostMapping("/payment/{paymentMethod}")
    public ResponseEntity<?> createPaymentLink(@RequestBody Address shippingAddress,@PathVariable String paymentMethod, @RequestHeader("Authorization") String jwt) throws RazorpayException, UserException, ProductException {
        if (paymentMethod.equals("CASH_ON_DELIVERY")){
            User user = userService.findUserProfileByJwt(jwt);
            Order order = orderService.createOrder(user, shippingAddress);

            String orderDay = order.getOrderDate().getDayOfWeek().toString();
            String orderMonth = order.getOrderDate().getMonth().toString();
            String dateOrder = String.valueOf(order.getOrderDate().getDayOfMonth());
            String orderYear = String.valueOf(order.getOrderDate().getYear());
            orderDay = capitalizeFirstLetter(orderDay);
            orderMonth = capitalizeFirstLetter(orderMonth);

            String orderDate = orderDay+", "+dateOrder+" "+orderMonth+" "+orderYear;


            String deliveryDay = order.getDeliveryDate().getDayOfWeek().toString();
            String deliveryMonth = order.getDeliveryDate().getMonth().toString();
            String dateDelivery = String.valueOf(order.getDeliveryDate().getDayOfMonth());
            String deliveryYear = String.valueOf(order.getOrderDate().getYear());

            String deliveryDate = deliveryDay+", "+dateDelivery+" "+deliveryMonth+" "+deliveryYear;

            PaymentResponse paymentResponse = new PaymentResponse();
            paymentResponse.setOrderId(order.getId());
            paymentResponse.setOrderItems(order.getOrderItems());
            paymentResponse.setOrderDate(orderDate);
            paymentResponse.setDeliveryDate(deliveryDate);
            paymentResponse.setShippingAddress(order.getShippingAddresses());
            paymentResponse.setPaymentMethod(order.getPaymentDetails().getPaymentMethod());
            paymentResponse.setPaymentStatus(order.getPaymentDetails().getPaymentStatus());
            paymentResponse.setTotalPrice(order.getTotalPrice());
            paymentResponse.setTotalDiscountedPrice(order.getTotalDiscountedPrice());
            paymentResponse.setDiscount(order.getDiscount());

            cartItemService.updateProductsQuantity(user.getId());
            String fullName = user.getFirstName()+" "+user.getLastName();
            emailService.order(fullName,user.getEmail(),order.getId(),order.getOrderDate(),order.getDeliveryDate(),order.getTotalDiscountedPrice(),order.getDiscount(),paymentResponse.getPaymentMethod(),paymentResponse.getPaymentStatus(),paymentResponse.getShippingAddress());

            Long id = user.getId();
            cartItemRepository.deleteCartItemsByUserId(id);
//            cartRepository.deleteCartByUserId(id);
//            cartService.CreateCart(user);
            return new ResponseEntity<>(paymentResponse,HttpStatus.CREATED);
        }
         {
            try {
                User user = userService.findUserProfileByJwt(jwt);
                Order order = orderService.createOrder(user, shippingAddress);
                RazorpayClient razorpay = new RazorpayClient(apiKey,apiSecret);
                JSONObject paymentLinkRequest = new JSONObject();
                paymentLinkRequest.put("amount",order.getTotalPrice()*100);
                paymentLinkRequest.put("currency","INR");

                JSONObject customer = new JSONObject();
                customer.put("name", order.getUser().getFirstName());
                customer.put("email",order.getUser().getEmail());
                paymentLinkRequest.put("customer",customer);

                JSONObject notify = new JSONObject();
                notify.put("sms",true);
                notify.put("email",true);

                paymentLinkRequest.put("notify",notify);

                paymentLinkRequest.put("callback_url","http://localhost:3000/payment/"+order.getId());//FrontEnd URL
                paymentLinkRequest.put("callback_method","get");

                PaymentLink payment = razorpay.paymentLink.create(paymentLinkRequest);

                String paymentLinkId = payment.get("id");
                String paymentLinkUrl = payment.get("Short_url");

                PaymentLinkResponse res = new PaymentLinkResponse();
                res.setPayment_link_id(paymentLinkId);
                res.setPayment_link_url(paymentLinkUrl);

                return new ResponseEntity<PaymentLinkResponse>(res,HttpStatus.CREATED);
            } catch (RazorpayException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse> redirect(@RequestParam(name = "payment_id")String paymentId, @RequestParam(name = "order_id")Long orderId) throws OrderException, RazorpayException {
        Order order = orderService.findOrderById(orderId);
        RazorpayClient razorpayClient = new RazorpayClient(apiKey,apiSecret);

        try {
            Payment payment = razorpayClient.payments.fetch(paymentId);
            if (payment.get("status").equals("captured")){
                order.getPaymentDetails().setPaymentId(paymentId);
                order.getPaymentDetails().setPaymentStatus("COMPLETED");
                order.setOrderStatus("PLACED");
                orderRepository.save(order);

            }
            ApiResponse apiResponse = new ApiResponse();
            apiResponse.setMessage("Your Order get placed");;
            apiResponse.setStatus(true);

            return new ResponseEntity<ApiResponse>(apiResponse,HttpStatus.ACCEPTED);
        }catch (Exception ex){
            throw new RazorpayException(ex.getMessage());
        }
    }
    public String capitalizeFirstLetter(String str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}