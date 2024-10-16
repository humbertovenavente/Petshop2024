import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Forgotpassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    
    // Enviar email al backend para restablecer la contraseña
    axios.post('http://172.16.72.69/forgotpassword.php', { email })
      .then(response => {
        setLoading(false);
        if (response.data.success) {
          // Mostrar mensaje de éxito usando `alert()`
          alert('Reset password email was sent to you, please check your email');
        } else if (response.data.error) {
          // Mostrar mensaje de error usando `alert()`
          alert(response.data.error);
        }
      })
      .catch(() => {
        setLoading(false);
        // Mostrar mensaje de error en caso de fallo general
        alert('Something went wrong. Please try again later.');
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}>
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>

          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input
              type="email"
              placeholder='Enter email'
              className='form-control rounded-0'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type='submit' className='btn btn-success w-100' disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Send email'
            )}
          </button>

          <p></p>
          <Link to="/login" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Back</Link>
        </form>
      </div>
    </div>
  );
}

export default Forgotpassword;
