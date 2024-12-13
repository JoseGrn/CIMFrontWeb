// src/components/AddProductModal.js
import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button } from '@mui/material';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const AddProductModal = ({ open, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    pesoDisponible: '',
    precioPorLibra: '',
    precioPorMediaLibra: '',
    cantidadMinima: '',
    tipoEmpaque: 'Caja',
    estado: 1,
    pesoXCaja: '',
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          ...formData,
          pesoDisponible: parseFloat(formData.pesoDisponible),
          precioPorLibra: parseFloat(formData.precioPorLibra),
          precioPorMediaLibra: parseFloat(formData.precioPorMediaLibra),
          cantidadMinima: parseInt(formData.cantidadMinima, 10),
          pesoXCaja: parseFloat(formData.pesoXCaja),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Producto creado exitosamente',
          text: `Producto: ${data.producto}`,
        });
        onProductAdded();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Error al crear el producto',
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
          Agregar Producto
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nombre" name="nombre" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Descripción" name="descripcion" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Peso Disponible" name="pesoDisponible" type="number" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Precio por Libra" name="precioPorLibra" type="number" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Precio por Media Libra" name="precioPorMediaLibra" type="number" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Cantidad Mínima" name="cantidadMinima" type="number" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Peso por Caja" name="pesoXCaja" type="number" fullWidth margin="normal" onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Crear Producto
          </Button>
          <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onClose}>
            Cancelar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
