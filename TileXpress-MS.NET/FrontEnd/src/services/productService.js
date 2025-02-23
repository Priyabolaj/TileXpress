import api from './api';

export const productService = {
  // User methods
  getAllProducts: async () => {
    return await api.get('/products');
  },

  getProduct: async (id) => {
    return await api.get(`/products/${id}`);
  },

  getProductsByCategory: async (categoryId) => {
    return await api.get(`/products/category/${categoryId}`);
  },

  // Admin methods
  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },

  updateStock: async (id, quantity) => {
    return await api.patch(`/products/${id}/stock`, quantity);
  }
};