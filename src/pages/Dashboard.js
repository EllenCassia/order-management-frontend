import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  People, 
  Inventory, 
  ShoppingCart, 
  Warning,
  TrendingUp,
  Star
} from '@mui/icons-material';

import { clientService } from '../services/clientService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { useNotification } from '../contexts/NotificationContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    vipClientsCount: 0,
    totalProducts: 0,
    totalOrders: 0,
    lowStockProducts: [],
    outOfStockOrders: []
  });
  const [loading, setLoading] = useState(true);
  
  const { showNotification } = useNotification();

  const loadDashboardData = async () => {
    try {
      const [
        vipCount,
        products,
        orders,
        lowStockProducts,
        outOfStockOrders
      ] = await Promise.all([
        clientService.getVipCount(),
        productService.getAllActive(),
        orderService.getAll(),
        productService.getLowStock(10),
        orderService.getOutOfStock()
      ]);

      setStats({
        vipClientsCount: vipCount,
        totalProducts: products.length,
        totalOrders: orders.length,
        lowStockProducts: lowStockProducts.slice(0, 5), // Mostrar apenas os 5 primeiros
        outOfStockOrders: outOfStockOrders.slice(0, 5)  // Mostrar apenas os 5 primeiros
      });
    } catch (error) {
      showNotification('Erro ao carregar dados do dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {loading ? <CircularProgress size={24} /> : value}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Cards de Estatísticas */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clientes VIP"
            value={stats.vipClientsCount}
            icon={<Star sx={{ fontSize: 40 }} />}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Produtos"
            value={stats.totalProducts}
            icon={<Inventory sx={{ fontSize: 40 }} />}
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Pedidos"
            value={stats.totalOrders}
            icon={<ShoppingCart sx={{ fontSize: 40 }} />}
            color="success"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Produtos em Falta"
            value={stats.lowStockProducts.length}
            icon={<Warning sx={{ fontSize: 40 }} />}
            color="error"
          />
        </Grid>

        {/* Produtos com Estoque Baixo */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                Produtos com Estoque Baixo
              </Typography>
              {stats.lowStockProducts.length === 0 ? (
                <Typography color="textSecondary">
                  Nenhum produto com estoque baixo
                </Typography>
              ) : (
                <List>
                  {stats.lowStockProducts.map((product) => (
                    <ListItem key={product.id} divider>
                      <ListItemIcon>
                        <TrendingUp color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={product.name}
                        secondary={`Estoque: ${product.stockQuantity} unidades`}
                      />
                      <Chip
                        label={product.stockQuantity === 0 ? 'Sem Estoque' : 'Estoque Baixo'}
                        color={product.stockQuantity === 0 ? 'error' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pedidos Fora de Estoque */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pedidos Fora de Estoque
              </Typography>
              {stats.outOfStockOrders.length === 0 ? (
                <Typography color="textSecondary">
                  Nenhum pedido fora de estoque
                </Typography>
              ) : (
                <List>
                  {stats.outOfStockOrders.map((order) => (
                    <ListItem key={order.id} divider>
                      <ListItemIcon>
                        <Warning color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Pedido #${order.id?.substring(0, 8)}`}
                        secondary={`Quantidade: ${order.quantity}`}
                      />
                      <Chip
                        label="Fora de Estoque"
                        color="error"
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Resumo Rápido */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Sistema
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={2}>
                    <People sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">Gestão de Clientes</Typography>
                    <Typography color="textSecondary">
                      Controle clientes VIP e regulares
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={2}>
                    <Inventory sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
                    <Typography variant="h6">Controle de Estoque</Typography>
                    <Typography color="textSecondary">
                      Monitore produtos e estoques
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={2}>
                    <ShoppingCart sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">Gestão de Pedidos</Typography>
                    <Typography color="textSecondary">
                      Acompanhe status dos pedidos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;