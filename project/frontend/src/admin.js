import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Home';

function Admin() {

  const navigate = useNavigate();  // Hook de react-router-dom para redireccionar
  const userRole = localStorage.getItem('userRole');

  // useEffect para verificar si el usuario es admin
  useEffect(() => {
    // Si el rol no es admin o empleado, redirigir a home
    if (userRole !== '3' && userRole !== '2') {
      navigate('/');  // Redirigir a la página principal
    }
  }, [userRole, navigate]);
 
  // Si el usuario no es administrador ni empleado, no permitir el acceso
  if (userRole !== '3' && userRole !== '2') {
    return <div>No tienes acceso a esta página.</div>;
  }
 
  return (
    <div> 
     <Home /> 
    </div>
  );
}

export default Admin;


