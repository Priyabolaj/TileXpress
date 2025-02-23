package com.tilexpress.services;

import com.tilexpress.model.OrderItem;
import com.tilexpress.repositories.OrderItemRepository;

public class OrderItemServiceImplementation implements OrderItemService{

    private OrderItemRepository orderItemRepository;
    @Override
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }
}
