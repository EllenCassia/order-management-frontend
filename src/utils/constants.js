// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pendente',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.SHIPPED]: 'Enviado',
  [ORDER_STATUS.DELIVERED]: 'Entregue',
  [ORDER_STATUS.CANCELLED]: 'Cancelado'
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.CONFIRMED]: 'info',
  [ORDER_STATUS.SHIPPED]: 'primary',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error'
};

// Stock Levels
export const STOCK_LEVELS = {
  OUT_OF_STOCK: 0,
  LOW_STOCK: 10,
  NORMAL_STOCK: 50
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 0
};

// Messages
export const MESSAGES = {
  SUCCESS: {
    CLIENT_CREATED: 'Cliente criado com sucesso',
    CLIENT_UPDATED: 'Cliente atualizado com sucesso',
    PRODUCT_CREATED: 'Produto criado com sucesso',
    PRODUCT_UPDATED: 'Produto atualizado com sucesso',
    STOCK_UPDATED: 'Estoque atualizado com sucesso',
    ORDER_CREATED: 'Pedido criado com sucesso',
    ORDER_UPDATED: 'Pedido atualizado com sucesso',
    ORDER_DELETED: 'Pedido excluído com sucesso',
    STATUS_UPDATED: 'Status atualizado com sucesso'
  },
  ERROR: {
    LOAD_CLIENTS: 'Erro ao carregar clientes',
    LOAD_PRODUCTS: 'Erro ao carregar produtos',
    LOAD_ORDERS: 'Erro ao carregar pedidos',
    SAVE_CLIENT: 'Erro ao salvar cliente',
    SAVE_PRODUCT: 'Erro ao salvar produto',
    SAVE_ORDER: 'Erro ao salvar pedido',
    DELETE_ORDER: 'Erro ao excluir pedido',
    UPDATE_STOCK: 'Erro ao atualizar estoque',
    UPDATE_STATUS: 'Erro ao atualizar status',
    DASHBOARD_DATA: 'Erro ao carregar dados do dashboard'
  },
  WARNING: {
    REQUIRED_FIELDS: 'Todos os campos obrigatórios devem ser preenchidos',
    INVALID_EMAIL: 'Email inválido',
    INVALID_QUANTITY: 'Quantidade deve ser maior que zero',
    INVALID_PRICE: 'Preço deve ser maior que zero',
    CONFIRM_DELETE: 'Tem certeza que deseja excluir este item?'
  }
};