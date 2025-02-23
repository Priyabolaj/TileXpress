import api from './api';

export const categoryService = {
  getAllCategories: async () => {
    return await api.get('/categories');
  },

  getCategory: async (id) => {
    return await api.get(`/categories/${id}`);
  },

  // Admin methods
  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  }
};