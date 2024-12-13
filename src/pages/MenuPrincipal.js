// src/pages/MenuPrincipal.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AddProductModal from '../components/AddProductModal';
import AddComboModal from '../components/AddComboModal';
import EditProductModal from '../components/EditProductModal';
import EditComboModal from '../components/EditComboModal';
import CreateSaleModal from '../components/CreateSaleModal';
import AddInventoryModal from '../components/AddInventoryModal';
import { Button, Box, CircularProgress, Typography } from '@mui/material';
import '../styles/MenuPrincipal.css';

const MenuPrincipal = () => {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showComboModal, setShowComboModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showComboEditModal, setShowComboEditModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchProducts();
    fetchCombos();
  }, [token]);

  // Función para obtener el rol del usuario
  const fetchUserRole = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/role', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserRole(data.message); // "Administrador" o "Vendedor"
      } else {
        setError('Error al obtener el rol del usuario');
      }
    } catch (err) {
      setError('Error de conexión al obtener el rol del usuario');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener productos
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/product/all', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      setError('Error de conexión al cargar productos');
    }
  };

  // Función para obtener combos
  const fetchCombos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/combo/all', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCombos(data.combos);
      } else {
        setError('Error al cargar combos');
      }
    } catch (err) {
      setError('Error de conexión al cargar combos');
    }
  };

  const handleEditProduct = (productId) => {
    if (userRole === 'Administrador') {
      setSelectedProductId(productId);
      setShowEditModal(true);
    }
  };

  const handleEditCombo = (comboId) => {
    if (userRole === 'Administrador') {
      setSelectedComboId(comboId);
      setShowComboEditModal(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Box className="menu-container">
        <h1>Bienvenido al Menú Principal</h1>

        {error && <Typography color="error">{error}</Typography>}

        <Box className="section">
          <h2>Productos Disponibles</h2>
          <Box className="card-container">
            {products.map((product) => (
              <Box
                key={product.ProductoID}
                className={`product-card ${userRole !== 'Administrador' ? 'disabled' : ''}`}
                onClick={() => handleEditProduct(product.ProductoID)}
              >
                <h3>{product.Nombre}</h3>
                <p><strong>Precio por Libra:</strong> ${product.PrecioPorLibra}</p>
                <p><strong>Precio por Media Libra:</strong> ${product.PrecioPorMediaLibra}</p>
                <p><strong>Peso Disponible:</strong> {product.PesoDisponible} lbs</p>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="section">
          <h2>Combos Disponibles</h2>
          <Box className="card-container">
            {combos.map((combo) => (
              <Box
                key={combo.ComboID}
                className={`product-card ${userRole !== 'Administrador' ? 'disabled' : ''}`}
                onClick={() => handleEditCombo(combo.ComboID)}
              >
                <h3>{combo.NombreCombo}</h3>
                <p><strong>Descripción:</strong> {combo.Descripcion}</p>
                <p><strong>Precio:</strong> ${combo.PrecioCombo}</p>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="button-container">
          {userRole === 'Administrador' && (
            <>
              <Button variant="contained" color="primary" className="menu-button" onClick={() => navigate('/usuarios')}>
                Usuarios
              </Button>
              <Button variant="contained" color="success" className="menu-button" onClick={() => setShowModal(true)}>
                Agregar Producto
              </Button>
              <Button variant="contained" color="success" className="menu-button" onClick={() => setShowComboModal(true)}>
                Agregar Combo
              </Button>
              <Button variant="contained" color="success" className="menu-button" onClick={() => setShowInventoryModal(true)}>
                Agregar Inventario
              </Button>
            </>
          )}
          <Button variant="contained" color="warning" className="menu-button" onClick={() => setShowSaleModal(true)}>
            Realizar Venta
          </Button>
          {userRole === 'Administrador' && (
            <Button variant="contained" color="warning" className="menu-button" onClick={() => navigate('/ventas')}>
              Ventas
            </Button>
          )}
        </Box>

        {/* Modales */}
        <AddProductModal open={showModal} onClose={() => setShowModal(false)} onProductAdded={fetchProducts} />
        <AddComboModal open={showComboModal} onClose={() => setShowComboModal(false)} onComboAdded={fetchCombos} />
        <EditProductModal open={showEditModal} onClose={() => setShowEditModal(false)} productId={selectedProductId} onProductUpdated={fetchProducts} />
        <EditComboModal open={showComboEditModal} onClose={() => setShowComboEditModal(false)} comboId={selectedComboId} onComboUpdated={fetchCombos} />
        <CreateSaleModal open={showSaleModal} onClose={() => setShowSaleModal(false)} onSaleCreated={fetchProducts} availableProducts={products} availableCombos={combos} />
        <AddInventoryModal open={showInventoryModal} onClose={() => setShowInventoryModal(false)} onInventoryAdded={fetchProducts} availableProducts={products} />
      </Box>
    </Box>
  );
};

export default MenuPrincipal;
