// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar todos los valores almacenados temporalmente
    localStorage.clear();
    // Redirigir a la página de login
    navigate('/');
  };

  return (
    <header className="header">
      <h1 className="header-title">Tienda de Mariscos</h1>
      <button className="logout-button" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </header>
  );
};

export default Header;
