import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function ReactivateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (token) {
      // Cambia la URL a la ruta correcta en tu servidor
      fetch('http://192.168.0.16/reactivate.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),  // Enviar el token en el cuerpo de la solicitud
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Your account is being activated...');
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } else {
            alert(data.message || 'Activating your account');
            navigate('/login');
          }
        })
        .catch(error => {
          console.error('Error reactivating account:', error);
          alert('An error occurred. Please try again later.');
          navigate('/login');
        });
    } else {
      alert('Token not provided.');
      navigate('/login');
    }
  }, [token, navigate]);

  return <div>Your account is being activated...</div>;
}

export default ReactivateAccount;
