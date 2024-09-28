import React from 'react';

function Emp() {
  const userName = localStorage.getItem('userName'); // Obtén el nombre del usuario desde localStorage
 
  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange'}}> 
      <div className='bg-white p-3 rounded w-25'>
        <header>Welcome back</header>
        <p>{userName}</p> {/* Si userName existe, lo muestra */}
      </div>
    </div>
  );
}

export default Emp;
