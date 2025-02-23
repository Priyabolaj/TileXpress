import api from './api';

export const cartService = {
  getCart: async () => {
    return await api.get('/cart');
  },

  addToCart: async (productId, quantity) => {
    return await api.post('/cart/items', { productId, quantity });
  },

  updateQuantity: async (productId, quantity) => {
    return await api.put(`/cart/items/${productId}`, { quantity });
  },

  removeFromCart: async (productId) => {
    return await api.delete(`/cart/items/${productId}`);
  },

  clearCart: async () => {
    return await api.delete('/cart');
  }
};
