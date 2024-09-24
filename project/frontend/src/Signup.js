import React, { useState} from 'react';
import { Link } from 'react-router-dom'
import Validation from './signupValidation';

function Signup() {

  const [values, setValues] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',

  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

  };

  const handleInput =(event) =>{
    setValues(prev => ({...prev, [event.target.name]: event.target.value}));

  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange'}}> 
    <div className='bg-white p-3 rounded w-25'>
      <form action="" onSubmit={handleSubmit}>
      <p>Sign up</p>

      <div className='mb-3'>
          <label htmlFor='name'> Name </label>
          <input type="name"placeholder='Enter name' name='name' onChange={handleInput} className='form-control rounded-0'></input>
          {errors.name && <span className='text-danger'>{errors.name}</span>}
        </div>

        <div className='mb-3'>
          <label htmlFor='lastname'> Lastname </label>
          <input type="lastname"placeholder='Enter lastname' lastname='lastname' onChange={handleInput} className='form-control rounded-0'></input>
          {errors.lastname && <span className='text-danger'>{errors.lastname}</span>}
        </div>

        <div className='mb-3'>
          <label htmlFor='email'> Email </label>
          <input type="email"placeholder='Enter email' email='email' onChange={handleInput} className='form-control rounded-0'></input>
          {errors.email && <span className='text-danger'>{errors.email}</span>}
        </div>

        <div className='mb-3'>
          <label htmlFor='password'> Password </label>
          <input type="password" placeholder='Enter password' password='password' onChange={handleInput} className='form-control rounded-0'></input>
          {errors.password && <span className='text-danger'>{errors.password}</span>}
        </div>
    
        <div className='mb-3'>
          <label htmlFor='role'> Select role</label>
          <select className='form-select' id='role'> {/* Form-select vi que era una clase de BS para darle estilo */}
              <option value="user">User</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

        </div>



        <button type='submit' className='btn btn-success w-100' > Create an account</button>
      <p></p>
      <Link to="/" className='btn btn-default border w-100 gb-light rounded-0 text-decoration-none'>Back</Link>
      
      </form>
    </div>
  </div>  )
}

export default Signup