// src/components/EditUserModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, Switch, FormControlLabel } from '@mui/material';
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

const EditUserModal = ({ open, onClose, userId, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    estado: 1,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Obtener los datos del usuario por su ID
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
          headers: {
            'Authorization': `${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData({
            nombre: data.user.Nombre,
            apellido: data.user.Apellido,
            email: data.user.Email,
            rol: data.user.Rol,
            estado: data.user.Estado,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los datos del usuario',
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

    if (open && userId) {
      fetchUser();
    }
  }, [open, userId, token]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el cambio del switch de estado
  const handleSwitchChange = (e) => {
    setFormData({ ...formData, estado: e.target.checked ? 1 : 0 });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/auth/edit/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: data.message,
        });
        onUserUpdated();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Error al actualizar el usuario',
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
          Editar Usuario
        </Typography>
        {loading ? (
          <Typography>Cargando...</Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField label="Nombre" name="nombre" fullWidth margin="normal" value={formData.nombre} onChange={handleChange} required />
            <TextField label="Apellido" name="apellido" fullWidth margin="normal" value={formData.apellido} onChange={handleChange} required />
            <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} required />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select name="rol" value={formData.rol} onChange={handleChange} required>
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Vendedor">Vendedor</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Switch checked={formData.estado === 1} onChange={handleSwitchChange} />}
              label={formData.estado === 1 ? 'Activado' : 'Desactivado'}
            />

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

export default EditUserModal;
