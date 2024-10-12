import React from 'react';
import Header from './header';
import Footer from './footer';
import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


  

function User() {
  const navigate = useNavigate();  // Hook de react-router-dom para redireccionar

  // useEffect para redirigir automáticamente
  useEffect(() => {
    navigate('/Home');  // Redirige a la ruta /Home
  }, [navigate]);
  
  const userName = localStorage.getItem('userName'); // Obtén el nombre del usuario desde localStorage
  const userRole = localStorage.getItem('userRole');
  
    if (userRole !== '1') {
      return <div>No tienes acceso a esta página.</div>;
    }
 
  return (
    <div id="root"> 
      <Header />
        <main className="main">Welcome back
        <p>{userName}</p> {/* Si userName existe, lo muestra */}
        </main>
    <Footer /> </div>
  );
}

    

export default User