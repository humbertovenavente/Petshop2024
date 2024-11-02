import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyAccount = () => {
  const [message, setMessage] = useState('Verifying your account...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
  
    console.log("Token:", token); // Verificar si el token se captura correctamente
  
    if (token) {
      axios.post('http://192.168.0.14/verify.php', { token })
        .then(response => {
          console.log("Respuesta del servidor:", response.data); // Verificar respuesta del servidor
  
          if (response.data.message) {
            setMessage(response.data.message);
            setTimeout(() => {
              navigate('/Login');
            }, 3000);  // Redirige 
          } else {
            setMessage(response.data.error || 'Error occurred to verify.');
          }
        })
        .catch(error => {
          console.error("Error in verification:", error);  // Captura cualquier error
          setMessage('There was an error when try to verified your account.');
        });
    } else {
      setMessage('Token no válido.');
    }
  }, [location, navigate]);
  

  return (
    <div className="verify-container">
      <h2>Verificación de cuenta</h2>
      <p>{message}</p>
    </div>
  );
}

export default VerifyAccount;
