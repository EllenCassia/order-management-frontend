import api from './api';

export const    productService = {
  // Buscar produto por ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Buscar todos os produtos ativos
  getAllActive: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Buscar produtos disponíveis
  getAvailable: async () => {
    const response = await api.get('/products/available');
    return response.data;
  },

  // Criar novo produto
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Atualizar estoque do produto
  updateStock: async (id, stockQuantity) => {
    const response = await api.put(`/products/${id}/stock`, { stockQuantity });
    return response.data;
  },

  // Buscar produtos com estoque baixo
  getLowStock: async (threshold = 10) => {
    const response = await api.get(`/products/low-stock?threshold=${threshold}`);
    return response.data;
  },

  // Buscar nome do produto por ID
  getNameById: async (id) => {
    const response = await api.get(`/products/${id}/name`);
    return response.data;
  }
};