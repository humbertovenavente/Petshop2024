import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado de "loading"
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    // Extraer el token de los parámetros de la URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(''); // Limpiar errores previos

        // Verificar si las contraseñas coinciden
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Empezar a cargar
        setLoading(true);

        // Enviar la solicitud de restablecimiento al backend
        axios.post('http://192.168.0.131/resetPassword.php', {
            token,
            newPassword
        })
        .then((response) => {
            setLoading(false); // Terminar de cargar
            if (response.data.success) {
                alert('Password reset successfully'); // Mensaje de éxito
                navigate('/login'); // Redirigir a la página de login
            } else if (response.data.error) {
                alert(response.data.error); // Mostrar error como alerta
            }
        })
        .catch((error) => {
            setLoading(false); // Terminar de cargar
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again.'); // Mostrar error
        });
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}>
            <div className='bg-white p-3 rounded w-25'>
                <form onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>

                    {error && <p className="text-danger">{error}</p>}

                    <div className='mb-3'>
                        <label htmlFor='newPassword'>New Password</label>
                        <input
                            type="password"
                            placeholder='Enter new password'
                            className='form-control rounded-0'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            type="password"
                            placeholder='Confirm new password'
                            className='form-control rounded-0'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type='submit' className='btn btn-success w-100' disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
