import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    axios.post('/api/forgot-password', { email })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          alert('Reset password email was sent to you, please check your email');
          navigate('/login');
        } else if (response.data.error) {
          alert(response.data.error);
        }
      })
      .catch(() => {
        setLoading(false);
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

export default ForgotPassword;
