// src/components/CreateUserModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
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

const CreateUserModal = ({ open, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    username: '',
    password: '',
    email: '',
    rol: '',
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
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
          title: 'Usuario creado exitosamente',
          text: data.message,
        });
        onUserCreated();
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Error al crear el usuario',
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
          Crear Usuario
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Nombre" name="nombre" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Apellido" name="apellido" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Username" name="username" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" onChange={handleChange} required />
          
          <TextField
            select
            label="Rol"
            name="rol"
            fullWidth
            margin="normal"
            value={formData.rol}
            onChange={handleChange}
            required
          >
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Vendedor">Vendedor</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Crear Usuario
          </Button>
          <Button variant="outlined" color="error" fullWidth sx={{ mt: 1 }} onClick={onClose}>
            Cancelar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateUserModal;
