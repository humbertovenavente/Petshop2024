import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate(); 

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false); // Estado para el "loading"
  const [error, setError] = useState(null); // Estado para manejar errores

  // Maneja el inicio de sesión como invitado
  const handleGuestAccess = () => {
    localStorage.setItem('userRole', 'guest'); 
    navigate('/Account'); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Mostrar el loading cuando comienza la solicitud
    setError(null); // Resetear el estado de error antes de la nueva solicitud

    // Enviar los datos al backend para autenticación
    axios.post('http://172.16.72.69/login.php', values)
      .then(response => {
        const { data } = response;

        setLoading(false); // Ocultar el loading después de recibir la respuesta

        if (data.error) {
          alert(data.error); // Mostrar el error recibido del backend en una ventana emergente
        } else if (data.rol) {
          // Guardamos el rol, email, nombre y otros detalles en localStorage
          localStorage.setItem('email', values.email);
          localStorage.setItem('password', values.password); // También guardamos la contraseña
          localStorage.setItem('userRole', data.rol); 
          localStorage.setItem('userName', data.name); 

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
      })
      .catch(error => {
        setLoading(false); // Ocultar el loading en caso de error
        console.error("Error:", error);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      });
  };

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}> 
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <h1 className="login-title">Log In</h1>

          {/* Mostrar mensajes de error si ocurren */}
          {error && <p className="text-danger text-center">{error}</p>} {/* Centrar mensaje de error */}
       
          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input 
              type="email" 
              placeholder='Enter email' 
              name='email' 
              onChange={handleInput} 
              className='form-control rounded-0'
              required
              disabled={loading} // Desactivar el campo si está en estado "loading"
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input 
              type="password" 
              placeholder='Enter password' 
              name='password' 
              onChange={handleInput} 
              className='form-control rounded-0'
              required
              disabled={loading} // Desactivar el campo si está en estado "loading"
            />
          </div>

          <div className="text-end mb-3">
            <Link to="/forgotpassword" className="text-decoration-none">Forgot password?</Link>
          </div>

          <div className='d-grid gap-2'>
            {loading ? (
              <button className='btn btn-success' type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
              </button>
            ) : (
              <button type='submit' className='btn btn-success'>Log in</button>
            )}

            <Link to="/signup" className='btn btn-default border bg-light rounded-0 text-decoration-none'>Create an Account</Link>
            <p></p>
            <button 
              type="button" 
              className='btn btn-secondary'
              onClick={handleGuestAccess}
              disabled={loading} // Desactivar el botón si está en estado "loading"
            >
              Go back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
