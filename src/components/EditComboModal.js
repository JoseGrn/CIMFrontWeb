// src/components/EditComboModal.js
import React, { useEffect, useState } from 'react';
import { Box, Modal, Typography, TextField, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
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

const EditComboModal = ({ open, onClose, comboId, onComboUpdated }) => {
  const [formData, setFormData] = useState({
    nombreCombo: '',
    descripcion: '',
    precioCombo: '',
    estado: 1,
    productos: [],
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCombo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/combo/${comboId}`, {
          headers: { 'Authorization': `${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setFormData({
            nombreCombo: data.combo.NombreCombo,
            descripcion: data.combo.Descripcion,
            precioCombo: data.combo.PrecioCombo,
            estado: data.combo.Estado,
            productos: data.productos.map((p) => ({
              productoID: p.ProductoID,
              nombre: p.Nombre,
              cantidad: p.Cantidad,
            })),
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los datos del combo' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor' });
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/product/all', {
          headers: { 'Authorization': `${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products);
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar la lista de productos' });
      }
    };

    if (open && comboId) {
      fetchCombo();
      fetchProducts();
    }
  }, [open, comboId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProductos = [...formData.productos];
    updatedProductos[index][field] = value;
    setFormData({ ...formData, productos: updatedProductos });
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      productos: [...formData.productos, { productoID: '', nombre: '', cantidad: '' }],
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProductos = formData.productos.filter((_, i) => i !== index);
    setFormData({ ...formData, productos: updatedProductos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/combo/edit/${comboId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          nombreCombo: formData.nombreCombo,
          descripcion: formData.descripcion,
          precioCombo: parseFloat(formData.precioCombo),
          estado: formData.estado,
          productos: formData.productos.map((p) => ({
            productoID: parseInt(p.productoID, 10),
            cantidad: parseFloat(p.cantidad),
          })),
        }),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Combo actualizado', text: data.message });
        onComboUpdated();
        onClose();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Error al actualizar el combo' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor' });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>Editar Combo</Typography>
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField label="Nombre del Combo" name="nombreCombo" fullWidth margin="normal" value={formData.nombreCombo} onChange={handleChange} required />
            <TextField label="Descripción" name="descripcion" fullWidth margin="normal" value={formData.descripcion} onChange={handleChange} required />
            <TextField label="Precio del Combo" name="precioCombo" type="number" fullWidth margin="normal" value={formData.precioCombo} onChange={handleChange} required />

            {formData.productos.map((prod, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
                <FormControl fullWidth>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={prod.productoID}
                    onChange={(e) => handleProductChange(index, 'productoID', e.target.value)}
                    required
                  >
                    {products.map((product) => (
                      <MenuItem key={product.ProductoID} value={product.ProductoID}>{product.Nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField label="Cantidad" type="number" value={prod.cantidad} onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)} required />
                <IconButton color="error" onClick={() => handleRemoveProduct(index)}><RemoveCircleOutline /></IconButton>
              </Box>
            ))}

            <Button startIcon={<AddCircleOutline />} color="primary" onClick={handleAddProduct}>Agregar Producto</Button>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Guardar Cambios</Button>
            <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onClose}>Cancelar</Button>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default EditComboModal;
