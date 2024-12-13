// src/components/AddInventoryModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const AddInventoryModal = ({ open, onClose, onInventoryAdded, availableProducts = [] }) => {
  const [products, setProducts] = useState([{ productoID: '', cantidad: '' }]);
  const token = localStorage.getItem('token');

  // Manejar cambios en los productos
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  // Agregar un nuevo producto
  const addProduct = () => {
    setProducts([...products, { productoID: '', cantidad: '' }]);
  };

  // Eliminar un producto
  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/product/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          productos: products.map((p) => ({
            productoID: parseInt(p.productoID, 10),
            cantidad: parseInt(p.cantidad, 10),
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Inventario actualizado',
          text: data.message,
        });
        onInventoryAdded();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Error al actualizar el inventario',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Agregar Inventario
        </Typography>
        <form onSubmit={handleSubmit}>
          {products.map((prod, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={prod.productoID}
                  onChange={(e) => handleProductChange(index, 'productoID', e.target.value)}
                  required
                >
                  {availableProducts.map((product) => (
                    <MenuItem key={product.ProductoID} value={product.ProductoID}>
                      {product.Nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Cantidad"
                type="number"
                value={prod.cantidad}
                onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                required
              />
              <IconButton color="error" onClick={() => removeProduct(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircleOutline />} color="primary" onClick={addProduct}>
            Agregar Producto
          </Button>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Actualizar Inventario
          </Button>
          <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onClose}>
            Cancelar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddInventoryModal;