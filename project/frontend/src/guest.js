import React from 'react';
import Header from './header';  // Importar el header
import Footer from './footer';  // Importar el footer



function Guest() {
  return (
    <div>
      <Header />
      <div className="container my-5">
        <h2>Welcome to the Page</h2>
        <p>This is the employee dashboard where you can manage your tasks.</p>
        {/* Aquí puedes poner más contenido específico de la página de empleados */}
      </div>
      <Footer />
    </div>
  );
}

export default Guest;
