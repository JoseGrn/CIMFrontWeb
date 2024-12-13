// src/components/CreateSaleModal.js
import React, { useState, useMemo } from 'react';
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

const CreateSaleModal = ({ open, onClose, onSaleCreated, availableProducts = [], availableCombos = [] }) => {
  const [formData, setFormData] = useState({
    tipoVenta: 'Contado',
    detalleVenta: '',
    productos: [{ productoID: '', cantidad: '' }],
    combos: [{ comboID: '', cantidad: '' }],
  });
  const token = localStorage.getItem('token');

  // Calcular el total de la venta
  const total = useMemo(() => {
    let totalProductos = formData.productos.reduce((acc, prod) => {
      const product = availableProducts.find((p) => p.ProductoID === prod.productoID);
      if (product && prod.cantidad) {
        const cantidad = parseFloat(prod.cantidad);
        const precioPorLibra = parseFloat(product.PrecioPorLibra);
        const precioPorMediaLibra = parseFloat(product.PrecioPorMediaLibra);

        // Calcular subtotal basado en la cantidad
        const librasEnteras = Math.floor(cantidad);
        const mediaLibra = cantidad % 1 === 0.5 ? 1 : 0;
        const subtotal = librasEnteras * precioPorLibra + mediaLibra * precioPorMediaLibra;

        return acc + subtotal;
      }
      return acc;
    }, 0);

    let totalCombos = formData.combos.reduce((acc, combo) => {
      const selectedCombo = availableCombos.find((c) => c.ComboID === combo.comboID);
      if (selectedCombo && combo.cantidad) {
        acc += parseFloat(selectedCombo.PrecioCombo) * parseInt(combo.cantidad, 10);
      }
      return acc;
    }, 0);

    return totalProductos + totalCombos;
  }, [formData, availableProducts, availableCombos]);

  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar cambios en productos
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.productos];
    updatedProducts[index][field] = value;
    setFormData({ ...formData, productos: updatedProducts });
  };

  // Manejar cambios en combos
  const handleComboChange = (index, field, value) => {
    const updatedCombos = [...formData.combos];
    updatedCombos[index][field] = value;
    setFormData({ ...formData, combos: updatedCombos });
  };

  // Agregar un nuevo producto
  const addProduct = () => {
    setFormData({ ...formData, productos: [...formData.productos, { productoID: '', cantidad: '' }] });
  };

  // Eliminar un producto
  const removeProduct = (index) => {
    const updatedProducts = formData.productos.filter((_, i) => i !== index);
    setFormData({ ...formData, productos: updatedProducts });
  };

  // Agregar un nuevo combo
  const addCombo = () => {
    setFormData({ ...formData, combos: [...formData.combos, { comboID: '', cantidad: '' }] });
  };

  // Eliminar un combo
  const removeCombo = (index) => {
    const updatedCombos = formData.combos.filter((_, i) => i !== index);
    setFormData({ ...formData, combos: updatedCombos });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const productosConSubtotal = formData.productos.map((p) => {
        const product = availableProducts.find((prod) => prod.ProductoID === p.productoID);
        const cantidad = parseFloat(p.cantidad);
        const precioPorLibra = parseFloat(product.PrecioPorLibra);
        const precioPorMediaLibra = parseFloat(product.PrecioPorMediaLibra);
  
        // Calcular subtotal: cantidad entera * precioPorLibra + media libra * precioPorMediaLibra
        const librasEnteras = Math.floor(cantidad);
        const mediaLibra = cantidad % 1 === 0.5 ? 1 : 0;
        const subtotal = librasEnteras * precioPorLibra + mediaLibra * precioPorMediaLibra;
  
        return {
          productoID: parseInt(p.productoID, 10),
          cantidad: cantidad,
          subtotal: subtotal,
        };
      });
  
      const response = await fetch('http://localhost:5000/api/sales/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          tipoVenta: formData.tipoVenta,
          ganancia: 0,
          detalleVenta: formData.detalleVenta,
          productos: productosConSubtotal,
          combos: formData.combos.map((c) => ({
            comboID: parseInt(c.comboID, 10),
            cantidad: parseInt(c.cantidad, 10),
          })),
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Venta creada exitosamente',
          text: data.message,
        });
        onSaleCreated();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Error al crear la venta',
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
          Realizar Venta
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Tipo de Venta" name="tipoVenta" fullWidth margin="normal" value={formData.tipoVenta} onChange={handleChange} required />
          <TextField label="Detalle de Venta" name="detalleVenta" fullWidth margin="normal" value={formData.detalleVenta} onChange={handleChange} required />

          <Typography variant="h6" mt={3}>
            Productos
          </Typography>
          {formData.productos.map((prod, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select value={prod.productoID} onChange={(e) => handleProductChange(index, 'productoID', e.target.value)} required>
                  {availableProducts.map((product) => (
                    <MenuItem key={product.ProductoID} value={product.ProductoID}>
                      {product.Nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Cantidad" type="number" value={prod.cantidad} onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)} required />
              <IconButton color="error" onClick={() => removeProduct(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircleOutline />} color="primary" onClick={addProduct}>
            Agregar Producto
          </Button>

          <Typography variant="h6" mt={3}>
            Combos
          </Typography>
          {formData.combos.map((combo, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
              <FormControl fullWidth>
                <InputLabel>Combo</InputLabel>
                <Select value={combo.comboID} onChange={(e) => handleComboChange(index, 'comboID', e.target.value)} required>
                  {availableCombos.map((c) => (
                    <MenuItem key={c.ComboID} value={c.ComboID}>
                      {c.NombreCombo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Cantidad" type="number" value={combo.cantidad} onChange={(e) => handleComboChange(index, 'cantidad', e.target.value)} required />
              <IconButton color="error" onClick={() => removeCombo(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddCircleOutline />} color="primary" onClick={addCombo}>
            Agregar Combo
          </Button>

          <Typography variant="h6" mt={3} color="primary">
            Total: ${total.toFixed(2)}
          </Typography>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Crear Venta
          </Button>
          <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onClose}>
            Cancelar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateSaleModal;
