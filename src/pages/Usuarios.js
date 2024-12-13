// src/pages/Usuarios.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirección
import Header from '../components/Header';
import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';
import '../styles/Usuarios.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate(); // Hook para redirección

  // Función para obtener todos los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/all', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsuarios(data.users);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (err) {
      setError('Error de conexión al cargar usuarios');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [token]);

  // Función para abrir el modal de edición con el ID del usuario seleccionado
  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    setShowEditUserModal(true);
  };

  return (
    <Box>
      <Header />
      <Box className="usuarios-container">
        <Box className="usuarios-header">
          <Button variant="contained" color="inherit" onClick={() => navigate('/menu')}>
            Regresar
          </Button>
          <Typography variant="h4" gutterBottom>
            Gestión de Usuarios
          </Typography>
          <Button variant="contained" color="success" onClick={() => setShowCreateUserModal(true)}>
            Crear Usuario
          </Button>
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        <Box className="usuarios-content">
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <Card key={usuario.UsuarioID} className="usuario-card" onClick={() => handleEditUser(usuario.UsuarioID)}>
                <CardContent>
                  <Typography variant="h6">
                    {usuario.Nombre} {usuario.Apellido}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Username:</strong> {usuario.Username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Rol:</strong> {usuario.Rol}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary">
              No hay usuarios disponibles.
            </Typography>
          )}
        </Box>

        <CreateUserModal open={showCreateUserModal} onClose={() => setShowCreateUserModal(false)} onUserCreated={fetchUsuarios} />
        <EditUserModal open={showEditUserModal} onClose={() => setShowEditUserModal(false)} userId={selectedUserId} onUserUpdated={fetchUsuarios} />
      </Box>
    </Box>
  );
};

export default Usuarios;
