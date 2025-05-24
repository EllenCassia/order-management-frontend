import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from '@mui/material';
import { People, Inventory, ShoppingCart, Dashboard } from '@mui/icons-material';

import { NotificationProvider } from './contexts/NotificationContext';
import ClientsPage from './pages/ClientsPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import DashboardPage from './pages/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de Gestão de Pedidos
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab 
                icon={<Dashboard />} 
                label="Dashboard" 
                iconPosition="start" 
              />
              <Tab 
                icon={<People />} 
                label="Clientes" 
                iconPosition="start" 
              />
              <Tab 
                icon={<Inventory />} 
                label="Produtos" 
                iconPosition="start" 
              />
              <Tab 
                icon={<ShoppingCart />} 
                label="Pedidos" 
                iconPosition="start" 
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <DashboardPage />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <ClientsPage />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <ProductsPage />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <OrdersPage />
          </TabPanel>
        </Container>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;