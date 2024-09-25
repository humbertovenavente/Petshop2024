import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {

  const [values, setValues] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInput = (event) => {
    // Actualiza el estado con los valores correctos
    setValues({
      ...values, 
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Enviar los datos directamente a la base de datos sin validación
    axios.post('http://localhost:8081/signup', values)
      .then(res => {
        console.log("Account created:", res.data);
        navigate('/');
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}>
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <p>Sign up</p>

          <div className='mb-3'>
            <label htmlFor='name'> Name </label>
            <input 
              type="text" 
              name='name' 
              placeholder='Enter name' 
              onChange={handleInput} 
              value={values.name} 
              className='form-control rounded-0'
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='lastname'> Lastname </label>
            <input 
              type="text" 
              name='lastname' 
              placeholder='Enter lastname' 
              onChange={handleInput} 
              value={values.lastname} 
              className='form-control rounded-0'
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='email'> Email </label>
            <input 
              type="email" 
              name='email' 
              placeholder='Enter email' 
              onChange={handleInput} 
              value={values.email} 
              className='form-control rounded-0'
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='password'> Password </label>
            <input 
              type="password" 
              name='password' 
              placeholder='Enter password' 
              onChange={handleInput} 
              value={values.password} 
              className='form-control rounded-0'
            />
          </div>

          

          <button type='submit' className='btn btn-success w-100'>Create an account</button>
          <p></p>
          <Link to="/" className='btn btn-default border w-100 gb-light rounded-0 text-decoration-none'>Back</Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;

