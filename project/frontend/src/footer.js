import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Footer() {
  const navigate = useNavigate();  
  const userRole = localStorage.getItem('userRole');
  const email = localStorage.getItem('email');  // Obtener el email del usuario

  const handleLogout = async () => {
    try {
      if (email) {
        // Actualizar el last_login antes de hacer el logout
        await axios.post('http://192.168.0.10/lastlogin.php', { email });
      }

      // Limpiar el localStorage y redirigir
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar last_login:', error);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <Link to="/about">About Us</Link>
        <Link to="/social">Social</Link>
        <Link to="/contact">Contact Us</Link>
        {userRole !== 'guest' && (
          <button onClick={handleLogout} className="btn btn-link">Log Out</button>
        )}
      </div>
    </footer>
  );
}

export default Footer;

