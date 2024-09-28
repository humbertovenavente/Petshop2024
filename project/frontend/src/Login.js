import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {

  const navigate = useNavigate(); 

  // acceso como invitado
  const handleGuestAccess = () => {
    navigate('/guest'); 
  };

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Enviar los datos al backend para autenticación
      const response = await axios.post('http://192.168.0.20/login.php', values);
      
      // Supongamos que el backend devuelve el rol del usuario
      const { data } = response;
      const userRole = data.role;
      const userName = data.name;

      console.log('Rol ', userRole);
      console.log('Nombre', userName);
  
      // Redirigir según el rol del usuario
      if (userRole === 3) {
       localStorage.setItem('userName', userName); // Usamos localStorage para mantener el nombre
        navigate('/admin');
      } else if (userRole === 2) {
        localStorage.setItem('userName', userName); // Usamos localStorage para mantener el nombre
        navigate('/emp');
      } else if (userRole === 2) {
        localStorage.setItem('userName', userName); // Usamos localStorage para mantener el nombre
        navigate('/user');
      }
    } catch (error) {
      console.log("Error:", error);
      alert('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleInput = (event) => {
    setValues(prev => ({...prev, [event.target.name]: event.target.value}));
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}> 
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <p>Log In</p>
       
          <div className='mb-3'> 
            <label htmlFor='email'>Email</label>
            <input type="email" placeholder='Enter email' name='email' onChange={handleInput} className='form-control rounded-0'></input>
          </div>

          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input type="password" placeholder='Enter password' name='password' onChange={handleInput} className='form-control rounded-0'></input>
          </div>

          <div className="text-end mb-3">
            <Link to="/forgotpassword" className="text-decoration-none">Forgot password?</Link>
          </div>

          <div className='d-grid gap-2'>
            <button type= 'submit' className='btn btn-success'>Log in</button>

            <Link to="/signup" className='btn btn-default border bg-light rounded-0 text-decoration-none'>Create an Account</Link>
            <p></p>
            <button 
              type="button" 
              className='btn btn-secondary'
              onClick={handleGuestAccess}
            >
              Access as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;


