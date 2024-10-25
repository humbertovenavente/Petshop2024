import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    // Extraer el token y el correo electrónico de los parámetros de la URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const emailFromUrl = queryParams.get('email');

    useEffect(() => {
        if (emailFromUrl) {
            setEmail(emailFromUrl); // Completar el campo de correo electrónico
        }
    }, [emailFromUrl]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        setError(''); // Limpiar cualquier mensaje de error previo

        console.log("Email:", email);
        console.log("New Password:", newPassword);
        console.log("Confirm Password:", confirmPassword);
        console.log("Token:", token);

        // Verificar si las contraseñas coinciden
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Empezar a cargar
        setLoading(true);

        try {
            // Enviar la solicitud de restablecimiento al backend
            const response = await axios.post('http://172.16.71.159/resetPassword.php', {
                email,
                token,
                newPassword
            });

            setLoading(false);
            console.log("Response:", response.data); // Mostrar la respuesta en la consola
            if (response.data.success) {
                alert('Password reset successfully'); // Mensaje de confirmación
                navigate('/Login'); // Redirigir a la página de login
            } else if (response.data.error) {
                alert(response.data.error); // Mostrar error
            }
        } catch (error) {
            setLoading(false);
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Reset Password</h2>
                <p>Your email is: {email}</p> {/* Mostrar el correo electrónico */}

                {error && <p className="text-danger">{error}</p>}

                <form onSubmit={handleSubmit}>
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
