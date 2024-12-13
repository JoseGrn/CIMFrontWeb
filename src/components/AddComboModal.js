// src/components/AddComboModal.js
import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, TextField, Button, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const AddComboModal = ({ open, onClose, onComboAdded }) => {
  const [formData, setFormData] = useState({
    nombreCombo: '',
    descripcion: '',
    precioCombo: '',
    productos: [{ productoID: '', cantidad: '' }],
  });

  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  // Obtener la lista de productos al abrir el modal
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product/all', {
          headers: { 'Authorization': `${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setProducts(data.products);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar la lista de productos',
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

    if (open) {
      fetchProducts();
    }
  }, [open, token]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProductos = [...formData.productos];
    updatedProductos[index][name] = value;
    setFormData({ ...formData, productos: updatedProductos });
  };

  const addProductField = () => {
    setFormData({ ...formData, productos: [...formData.productos, { productoID: '', cantidad: '' }] });
  };

  const removeProductField = (index) => {
    const updatedProductos = formData.productos.filter((_, i) => i !== index);
    setFormData({ ...formData, productos: updatedProductos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/combo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          nombreCombo: formData.nombreCombo,
          descripcion: formData.descripcion,
          precioCombo: parseFloat(formData.precioCombo),
          productos: formData.productos.map((prod) => ({
            productoID: parseInt(prod.productoID, 10),
            cantidad: parseInt(prod.cantidad, 10),
          })),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Combo creado exitosamente',
          text: `Combo ID: ${data.comboID}`,
        });
        onComboAdded();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Error al crear el combo',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Error de conexión al servidor',
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          Agregar Combo
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre del Combo"
            name="nombreCombo"
            fullWidth
            margin="normal"
            onChange={(e) => setFormData({ ...formData, nombreCombo: e.target.value })}
            required
          />
          <TextField
            label="Descripción"
            name="descripcion"
            fullWidth
            margin="normal"
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
          />
          <TextField
            label="Precio del Combo"
            name="precioCombo"
            type="text"
            fullWidth
            margin="normal"
            onChange={(e) => setFormData({ ...formData, precioCombo: e.target.value })}
            required
          />

          <Typography variant="subtitle1" mt={2}>
            Productos en el Combo
          </Typography>
          {formData.productos.map((prod, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select
                  name="productoID"
                  value={prod.productoID}
                  onChange={(e) => handleChange(e, index)}
                  required
                >
                  {products.map((product) => (
                    <MenuItem key={product.ProductoID} value={product.ProductoID}>
                      {product.Nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Cantidad"
                name="cantidad"
                type="number"
                fullWidth
                onChange={(e) => handleChange(e, index)}
                value={prod.cantidad}
                required
              />
              <IconButton onClick={() => removeProductField(index)} color="error">
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={addProductField}
            fullWidth
            sx={{ mb: 2 }}
          >
            Agregar Producto
          </Button>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Crear Combo
          </Button>
          <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onClose}>
            Cancelar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddComboModal;
