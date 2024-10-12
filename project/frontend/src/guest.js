import React from 'react';
import Header from './header';
import Footer from './footer';
import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Guest() {
  const navigate = useNavigate();  // Hook de react-router-dom para redireccionar

  // useEffect para redirigir automáticamente
  useEffect(() => {
    navigate('/Home');  // Redirige a la ruta /Home
  }, [navigate]);

  return (
    <div>
      <Header />
      <main className="main">
        <h2>Welcome!</h2>
        <p>This is the employee dashboard where you can manage your tasks.</p>
      </main>
      <Footer />
    </div>
  );
}

export default Guest;

