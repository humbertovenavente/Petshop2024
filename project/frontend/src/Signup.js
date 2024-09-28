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
    id_rol: '1' // I would like to put a default, since I can only use 1-2-3, it must starts as a default 1, id_role from role is 
  });

  const navigate = useNavigate();

  // Maneja la entrada del formulario y actualiza el estado
  const handleInput = (event) => {
    setValues({
      ...values, 
      [event.target.name]: event.target.value
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    // Enviar los datos al servidor PHP mediante Axios
    axios.post('http://192.168.0.20/signup.php', values)  // Cambia la IP por la de tu máquina virtual
      .then(res => {
        console.log("Account created:", res.data);
        if (res.data.message) {
          alert('The user was created successfully');
        }
        navigate('/');
      })
      .catch(err => {
        console.log("Error:", err);
        alert('Error ocurred when try to create the user');
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

          <div>
            <label className = 'mb-3'>Role</label>
            <select className = 'form-control rounded-0' name='id_rol' onChange={handleInput} value={values.id_rol}>
              <option value='1'>User</option>
              <option value='2'>Employee</option>
              <option value='3'> Administrator </option>
            </select>
      
          </div>
          <p></p>
          <button type='submit' className='btn btn-success w-100'>Create an account</button>
          <p></p>
          <Link to="/" className='btn btn-default border w-100 gb-light rounded-0 text-decoration-none'>Back</Link>
        </form>
      </div>
    </div>
  );
}

export default Signup

