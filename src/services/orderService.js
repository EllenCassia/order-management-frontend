import api from './api';

export const orderService = {
  // Criar novo pedido
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Buscar pedido por ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Buscar todos os pedidos
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Buscar pedidos por cliente com paginação
  getByClientId: async (clientId, page = 0, size = 20) => {
    const response = await api.get(`/orders/client/${clientId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Buscar pedidos por status
  getByStatus: async (status) => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },

  // Buscar pedidos por cliente e status
  getByClientIdAndStatus: async (clientId, status) => {
    const response = await api.get(`/orders/client/${clientId}/status/${status}`);
    return response.data;
  },

  // Buscar pedidos fora de estoque
  getOutOfStock: async () => {
    const response = await api.get('/orders/out-of-stock');
    return response.data;
  },

  // Contar pedidos por cliente
  countByClient: async (clientId) => {
    const response = await api.get(`/orders/client/${clientId}/count`);
    return response.data;
  },

  // Atualizar pedido
  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  // Deletar pedido
  delete: async (id) => {
    await api.delete(`/orders/${id}`);
  },

  // Atualizar status do pedido
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status?status=${status}`);
    return response.data;
  }
};