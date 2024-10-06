import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {

  const navigate = useNavigate(); 

  // acceso como invitado
  const handleGuestAccess = () => {
    localStorage.setItem('userRole', 'guest'); 
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
      const response = await axios.post('http://192.168.0.11/login.php', values);
      
      // Supongamos que el backend devuelve el rol del usuario
      const { data } = response;

      if (data.error){
        alert(data.error);
      }
  
      else if (data.rol) {
        // Guardamos el rol y otros detalles en localStorage
        localStorage.setItem('email', values.email);  // Guardar el email
        localStorage.setItem('password', values.password);  // Guardar la contraseña (no recomendable en proyectos reales)
        localStorage.setItem('userRole', data.rol);  // Guardar el rol
        localStorage.setItem('userName', data.name);  // Guardar el nombre
      
        // Redirigir al dashboard o página correspondiente según el rol
        if (data.rol === 3) {
          navigate('/admin');
        } else if (data.rol === 2) {
          navigate('/emp');
        } else if (data.rol === 1) {
          navigate('/user');
        }
      } else {
        alert('Credenciales incorrectas');
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


