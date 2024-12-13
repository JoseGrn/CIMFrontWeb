// src/pages/Ventas.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Ventas = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Header />
      <Box className="ventas-container" textAlign="center" p={3}>
        <Typography variant="h4" gutterBottom>
          Gestión de Ventas
        </Typography>
        <Typography variant="body1" mb={3}>
          Aquí puedes gestionar todas las ventas realizadas.
        </Typography>
        <Button variant="contained" color="grey" onClick={() => navigate('/menu')}>
          Regresar al Menú Principal
        </Button>
      </Box>
    </Box>
  );
};

export default Ventas;
