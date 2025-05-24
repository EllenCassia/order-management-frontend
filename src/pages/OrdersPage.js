import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

import { orderService } from '../services/orderService';
import { clientService } from '../services/clientService';
import { productService } from '../services/productService';
import { useNotification } from '../contexts/NotificationContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    clientId: '',
    productId: '', // Para o item do pedido
    quantity: '',  // Para a quantidade do item
    status: 'PENDING',
    // Não precisamos de 'items' aqui no formData, pois productId e quantity
    // representam o único item que estamos manipulando no formulário simplificado.
  });

  const { showNotification } = useNotification();

  const orderStatuses = [
    { value: 'PENDING', label: 'Pendente', color: 'warning' },
    { value: 'CONFIRMED', label: 'Confirmado', color: 'info' },
    { value: 'SHIPPED', label: 'Enviado', color: 'primary' },
    { value: 'DELIVERED', label: 'Entregue', color: 'success' },
    { value: 'CANCELLED', label: 'Cancelado', color: 'error' }
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      showNotification('Erro ao carregar pedidos', 'error');
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientService.getAllVipClients();
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showNotification('Erro ao carregar clientes', 'error');
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productService.getAvailable();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      showNotification('Erro ao carregar produtos', 'error');
    }
  };

  useEffect(() => {
    loadOrders();
    loadClients();
    loadProducts();
  }, []);

  const handleSubmit = async () => {
    if (!formData.clientId || !formData.productId || !formData.quantity) {
      showNotification('Todos os campos (Cliente, Produto, Quantidade) são obrigatórios', 'warning');
      return;
    }

    try {
      // Cria a estrutura de items que o backend espera
      const orderItems = [
        {
          productId: formData.productId,
          quantity: parseInt(formData.quantity),
        },
      ];

      const orderData = {
        clientId: formData.clientId,
        items: orderItems, // Adicionado para corresponder ao DTO do backend
        status: formData.status,
      };

      if (editingOrder) {
        await orderService.update(editingOrder.id, orderData);
        showNotification('Pedido atualizado com sucesso', 'success');
      } else {
        await orderService.create(orderData);
        showNotification('Pedido criado com sucesso', 'success');
      }

      handleCloseDialog();
      loadOrders();
    } catch (error) {
      console.error('Erro completo ao salvar pedido:', error.response?.data || error.message);
      showNotification('Erro ao salvar pedido: ' + (error.response?.data?.message || 'Verifique os dados.'), 'error');
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    // Extrai o productId e quantity do primeiro item do pedido,
    // assumindo que seu formulário edita apenas um item por vez.
    const firstItem = order.items && order.items.length > 0 ? order.items[0] : {};

    setFormData({
      clientId: order.clientId,
      productId: firstItem.productId || '',
      quantity: firstItem.quantity ? firstItem.quantity.toString() : '',
      status: order.status
    });
    setDialogOpen(true);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await orderService.delete(orderId);
        showNotification('Pedido excluído com sucesso', 'success');
        loadOrders();
      } catch (error) {
        showNotification('Erro ao excluir pedido', 'error');
        console.error('Erro ao excluir pedido:', error);
      }
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      showNotification('Status atualizado com sucesso', 'success');
      loadOrders();
    } catch (error) {
      showNotification('Erro ao atualizar status', 'error');
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrder(null);
    setFormData({ clientId: '', productId: '', quantity: '', status: 'PENDING' });
  };

  // Funções auxiliares para exibir dados na tabela
  const getStatusChip = (status) => {
    const statusInfo = orderStatuses.find(s => s.value === status);
    return (
      <Chip
        label={statusInfo?.label || status}
        color={statusInfo?.color || 'default'}
        size="small"
      />
    );
  };

  const formatDate = (dateString) => {
    // Adiciona uma verificação para garantir que dateString não é undefined ou null
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return dateString; // Retorna a string original se houver erro
    }
  };


  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const getProductName = (orderItem) => {
    // Para exibição na tabela, precisamos iterar sobre os itens do pedido
    // Assumindo que você quer exibir o nome do primeiro produto para simplificação
    if (!orderItem || !orderItem.items || orderItem.items.length === 0) {
      return 'N/A';
    }
    const product = products.find(p => p.id === orderItem.items[0].productId);
    return product?.name || 'Produto não encontrado';
  };

  const getProductQuantity = (orderItem) => {
    // Para exibição na tabela, assumindo que você quer exibir a quantidade do primeiro produto
    if (!orderItem || !orderItem.items || orderItem.items.length === 0) {
      return 'N/A';
    }
    return orderItem.items[0].quantity || 'N/A';
  };


  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Pedidos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Novo Pedido
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Pedido</TableCell> {/* Adicionado para melhor identificação */}
                <TableCell>Cliente</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell> {/* Exibe o ID do pedido */}
                  <TableCell>{getClientName(order.clientId)}</TableCell>
                  <TableCell>{getProductName(order)}</TableCell> {/* Passa o order completo */}
                  <TableCell>{getProductQuantity(order)}</TableCell> {/* Passa o order completo */}
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        displayEmpty
                      >
                        {orderStatuses.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt || new Date())}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(order)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => handleDelete(order.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Editar Pedido' : 'Novo Pedido'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  label="Cliente"
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name} {client.vip && '(VIP)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Produto</InputLabel>
                <Select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  label="Produto"
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} (Estoque: {product.stockQuantity})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                inputProps={{ min: "1" }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Status"
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersPage;