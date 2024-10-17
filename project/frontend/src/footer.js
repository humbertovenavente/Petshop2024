import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Footer() {
  const navigate = useNavigate();  
  const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario
  const email = localStorage.getItem('email');  // Obtener el email del usuario

  const handleLogout = async () => {
    try {
      if (email) {
        // Actualizar el last_login antes de hacer el logout
        await axios.post('http://192.168.0.131/lastlogin.php', { email });
      }
  
      // Guardar los artículos del carrito antes de limpiar el localStorage
      const cartItems = localStorage.getItem('cart'); 
      const storedCart = cartItems ? JSON.parse(cartItems) : [];
  
      // Limpiar todo excepto el carrito
      localStorage.clear();
      localStorage.setItem('cart', JSON.stringify(storedCart));  // Volver a guardar el carrito
  
      // Redirigir a la página de login
      navigate('/login');
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

        {/* Mostrar el botón de Log Out solo si el rol es '1', '2' o '3' */}
        {(userRole === '1' || userRole === '2' || userRole === '3') && (
          <button onClick={handleLogout} className="btn btn-link">
            Log Out
          </button>
        )}
      </div>
    </footer>
  );
}

export default Footer;
