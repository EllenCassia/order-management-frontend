import api from './api';

export const clientService = {
  // Buscar todos os clientes VIP
  getAllVipClients: async () => {
    const response = await api.get('/clients/vip');
    return response.data;
  },

  // Buscar cliente por ID
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Buscar cliente por email
  getByEmail: async (email) => {
    const response = await api.get(`/clients/email/${email}`);
    return response.data;
  },

  // Criar novo cliente
  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  // Atualizar cliente
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  // Contar clientes VIP
  getVipCount: async () => {
    const response = await api.get('/clients/vip/count');
    return response.data;
  }
};