import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyAccount = () => {
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
  
    console.log("Token capturado desde URL:", token); // Verificar si el token se captura correctamente
  
    if (token) {
      axios.post('http://172.16.72.69/verify.php', { token })
        .then(response => {
          console.log("Respuesta del servidor:", response.data); // Verificar respuesta del servidor
  
          if (response.data.message) {
            setMessage(response.data.message);
            setTimeout(() => {
              navigate('/Login');
            }, 3000);  // Redirige después de 3 segundos
          } else {
            setMessage(response.data.error || 'Error al verificar la cuenta.');
          }
        })
        .catch(error => {
          console.error("Error en la verificación:", error);  // Captura cualquier error
          setMessage('Hubo un problema al verificar tu cuenta.');
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
