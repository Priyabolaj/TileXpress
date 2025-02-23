// src/services/orderService.js
import api from './api';

export const orderService = {
  // User methods
  createOrder: async () => {
    return await api.post('/order/checkout');
  },

  getOrder: async (orderId) => {
    return await api.get(`/order/${orderId}`);
  },

  getUserOrders: async () => {
    return await api.get('/order');
  },

  // Admin methods
  getAllOrders: async () => {
    return await api.get('/order/all'); // Using the same endpoint as getUserOrders since backend handles the role check
  },

  updateOrderStatus: async (orderId, statusDto) => {
    return await api.put(`/order/${orderId}/status`, statusDto);
  }
};