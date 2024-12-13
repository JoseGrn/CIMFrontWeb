// src/components/EditProductModal.js
import React, { useEffect, useState } from 'react';
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

const EditProductModal = ({ open, onClose, productId, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    pesoDisponible: '',
    precioPorLibra: '',
    precioPorMediaLibra: '',
    cantidadMinima: '',
    tipoEmpaque: '',
    estado: 1,
    pesoXCaja: '',
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Obtener los datos del producto por su ID
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/product/${productId}`, {
          headers: {
            'Authorization': `${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData({
            nombre: data.product.Nombre,
            descripcion: data.product.Descripcion,
            pesoDisponible: data.product.PesoDisponible,
            precioPorLibra: data.product.PrecioPorLibra,
            precioPorMediaLibra: data.product.PrecioPorMediaLibra,
            cantidadMinima: data.product.CantidadMinima,
            tipoEmpaque: data.product.TipoEmpaque,
            estado: data.product.Estado,
            pesoXCaja: data.product.PesoXCaja || '',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los datos del producto',
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor',
        });
      } finally {
        setLoading(false);
      }
    };

    if (open && productId) {
      fetchProduct();
    }
  }, [open, productId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/product/edit/${productId}`, {
        method: 'PUT',
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

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          text: data.message,
        });
        onProductUpdated();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Error al actualizar el producto',
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
        <Typography variant="h6" component="h2" mb={2}>
          Editar Producto
        </Typography>
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField label="Nombre" name="nombre" fullWidth margin="normal" value={formData.nombre} onChange={handleChange} required />
            <TextField label="Descripción" name="descripcion" fullWidth margin="normal" value={formData.descripcion} onChange={handleChange} required />
            <TextField label="Peso Disponible" name="pesoDisponible" type="number" fullWidth margin="normal" value={formData.pesoDisponible} onChange={handleChange} required />
            <TextField label="Precio por Libra" name="precioPorLibra" type="number" fullWidth margin="normal" value={formData.precioPorLibra} onChange={handleChange} required />
            <TextField label="Precio por Media Libra" name="precioPorMediaLibra" type="number" fullWidth margin="normal" value={formData.precioPorMediaLibra} onChange={handleChange} required />
            <TextField label="Cantidad Mínima" name="cantidadMinima" type="number" fullWidth margin="normal" value={formData.cantidadMinima} onChange={handleChange} required />
            <TextField label="Tipo de Empaque" name="tipoEmpaque" fullWidth margin="normal" value={formData.tipoEmpaque} onChange={handleChange} required />
            <TextField label="Peso por Caja" name="pesoXCaja" type="number" fullWidth margin="normal" value={formData.pesoXCaja} onChange={handleChange} required />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Guardar Cambios
            </Button>
            <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onClose}>
              Cancelar
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default EditProductModal;
