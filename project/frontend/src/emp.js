import React from 'react';
import Header from './header';
import Footer from './footer';

function Emp() {
  const userName = localStorage.getItem('userName'); // Obtén el nombre del usuario desde localStorage
  const userRole = localStorage.getItem('userRole');
  
    if (userRole !== '2') {
      return <div>No tienes acceso a esta página.</div>;
    }
 
  return (
    <div> 
      <Header />
        <main className="main">Welcome back
        <p>{userName}</p> {/* Si userName existe, lo muestra */}
        </main>
    <Footer /> </div>
  );
}

export default Emp;


