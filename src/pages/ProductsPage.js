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
  TextField
} from '@mui/material';
import { Add, Edit, Warning } from '@mui/icons-material';

import { productService } from '../services/productService';
import { useNotification } from '../contexts/NotificationContext';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stockQuantity: ''
  });
  const [newStock, setNewStock] = useState('');
  
  const { showNotification } = useNotification();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllActive();
      setProducts(data);
    } catch (error) {
      showNotification('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.stockQuantity) {
      showNotification('Todos os campos são obrigatórios', 'warning');
      return;
    }

    try {
      await productService.create({
        name: formData.name,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity)
      });
      
      showNotification('Produto criado com sucesso', 'success');
      handleCloseDialog();
      loadProducts();
    } catch (error) {
      showNotification('Erro ao criar produto', 'error');
    }
  };

  const handleUpdateStock = async () => {
    if (!newStock || parseInt(newStock) < 0) {
      showNotification('Quantidade inválida', 'warning');
      return;
    }

    try {
      await productService.updateStock(selectedProduct.id, parseInt(newStock));
      showNotification('Estoque atualizado com sucesso', 'success');
      setStockDialogOpen(false);
      setSelectedProduct(null);
      setNewStock('');
      loadProducts();
    } catch (error) {
      showNotification('Erro ao atualizar estoque', 'error');
    }
  };

  const handleOpenStockDialog = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stockQuantity.toString());
    setStockDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({ name: '', price: '', stockQuantity: '' });
  };

  const handleCloseStockDialog = () => {
    setStockDialogOpen(false);
    setSelectedProduct(null);
    setNewStock('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStockChip = (quantity) => {
    if (quantity === 0) {
      return <Chip label="Sem Estoque" color="error" size="small" />;
    } else if (quantity <= 10) {
      return <Chip label="Estoque Baixo" color="warning" size="small" />;
    } else {
      return <Chip label="Disponível" color="success" size="small" />;
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Produtos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Novo Produto
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
                <TableCell>Nome</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Estoque</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {product.stockQuantity <= 10 && (
                        <Warning color="warning" sx={{ mr: 1, fontSize: 20 }} />
                      )}
                      {product.name}
                    </Box>
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stockQuantity}</TableCell>
                  <TableCell>
                    {getStockChip(product.stockQuantity)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleOpenStockDialog(product)}
                    >
                      Estoque
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      Nenhum produto encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog para criar produto */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Produto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Preço"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
            required
            inputProps={{ step: "0.01", min: "0" }}
          />
          <TextField
            fullWidth
            label="Quantidade em Estoque"
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
            margin="normal"
            required
            inputProps={{ min: "0" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Criar Produto
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para atualizar estoque */}
      <Dialog open={stockDialogOpen} onClose={handleCloseStockDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Atualizar Estoque - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nova Quantidade"
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            margin="normal"
            required
            inputProps={{ min: "0" }}
            helperText={`Estoque atual: ${selectedProduct?.stockQuantity || 0}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStockDialog}>Cancelar</Button>
          <Button onClick={handleUpdateStock} variant="contained">
            Atualizar Estoque
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;