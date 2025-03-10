package com.tilexpress.responses;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tilexpress.model.Address;
import com.tilexpress.model.CartItems;
import com.tilexpress.model.Order;
import com.tilexpress.model.OrderItem;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public class PaymentResponse {
   private Long orderId;
   private List<OrderItem> orderItems = new ArrayList<>();
   private String orderDate;
   private String deliveryDate;
   private Address shippingAddress;
   private String paymentMethod;
   private String paymentStatus;
   private Double totalPrice;
   private Integer totalDiscountedPrice;
   private Integer discount;

    public PaymentResponse() {
    }

    public PaymentResponse(Long orderId, List<OrderItem> orderItems, String orderDate, String deliveryDate, Address shippingAddress, String paymentMethod, String paymentStatus, Double totalPrice, Integer totalDiscountedPrice, Integer discount) {
        this.orderId = orderId;
        this.orderItems = orderItems;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.totalPrice = totalPrice;
        this.totalDiscountedPrice = totalDiscountedPrice;
        this.discount = discount;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getTotalDiscountedPrice() {
        return totalDiscountedPrice;
    }

    public void setTotalDiscountedPrice(Integer totalDiscountedPrice) {
        this.totalDiscountedPrice = totalDiscountedPrice;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }
}
