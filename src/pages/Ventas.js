// src/pages/Ventas.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import '../styles/Ventas.css';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const Ventas = () => {
  const navigate = useNavigate();
  const [ventasMes, setVentasMes] = useState([]);
  const [ventasSemana, setVentasSemana] = useState([]);
  const [ventasDia, setVentasDia] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchVentasMes();
    fetchVentasSemana();
    fetchVentasDia();
  }, []);

  // Funciones para obtener datos de ventas
  const fetchVentasMes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sales/month', {
        headers: { 'Authorization': `${token}` },
      });
      const data = await response.json();
      setVentasMes(data.sales);
    } catch (error) {
      console.error('Error al cargar ventas del mes:', error);
    }
  };

  const fetchVentasSemana = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sales/week', {
        headers: { 'Authorization': `${token}` },
      });
      const data = await response.json();
      setVentasSemana(data.sales);
    } catch (error) {
      console.error('Error al cargar ventas de la semana:', error);
    }
  };

  const fetchVentasDia = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sales/day', {
        headers: { 'Authorization': `${token}` },
      });
      const data = await response.json();
      setVentasDia(data.sales);
      console.log(data.sales)
      console.log('ventas por dia cargadas')
    } catch (error) {
      console.error('Error al cargar ventas del día:', error);
    }
  };

  return (
    <Box>
      <Header />
      <Box className="ventas-container">
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button variant="contained" color="grey" onClick={() => navigate('/menu')}>
            Regresar al Menú Principal
          </Button>
          <Typography variant="h4" gutterBottom>
            Gestión de Ventas
          </Typography>
        </Box>

        <Box className="charts-container">
          <Box className="chart">
            <Typography variant="h6">Ventas del Mes</Typography>
            <Bar
              data={{
                labels: ventasMes.map(v => v.fecha),
                datasets: [{ label: 'Ventas del Mes', data: ventasMes.map(v => v.total), backgroundColor: 'rgba(75, 192, 192, 0.6)' }],
              }}
              options={{ responsive: true }}
            />
          </Box>

          <Box className="chart">
            <Typography variant="h6">Ventas de la Semana</Typography>
            <Line
              data={{
                labels: ventasSemana.map(v => v.fecha),
                datasets: [{ label: 'Ventas de la Semana', data: ventasSemana.map(v => v.total), borderColor: 'rgba(153, 102, 255, 1)', backgroundColor: 'rgba(153, 102, 255, 0.2)' }],
              }}
              options={{ responsive: true }}
            />
          </Box>

          <Box className="chart">
            <Typography variant="h6">Ventas del Día</Typography>
            <Bar
              data={{
                labels: ventasDia.map(v => v.hora),
                datasets: [{ label: 'Ventas del Día', data: ventasDia.map(v => v.total), backgroundColor: 'rgba(255, 159, 64, 0.6)' }],
              }}
              options={{ responsive: true }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Ventas;
