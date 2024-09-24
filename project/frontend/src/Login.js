import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './loginValidation';

function Login() {

  const navigate = useNavigate(); 

  // acceso como invitado
  const handleGuestAccess = () => {
    navigate('/home'); 
  };

  const [values, setValues] = useState({
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
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}> 
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <p>Log In</p>
       
          <div className='mb-3'> 
            <label htmlFor='email'>Email</label>
            <input type="email" placeholder='Enter email' name='email' onChange={handleInput} className='form-control rounded-0'></input>
         {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input type="password" placeholder='Enter password' name='password' onChange={handleInput} className='form-control rounded-0'></input>
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>

          
          <div className="text-end mb-3">
            <Link to="/forgotpassword" className="text-decoration-none">Forgot password?</Link>
          </div>

         
          <div className='d-grid gap-2'>
            <button type= 'submit' className='btn btn-success'> Log in</button>

            <Link to="/signup" className='btn btn-default border bg-light rounded-0 text-decoration-none'>Create an Account</Link>
            <p></p>
            <button 
              type="button" 
              className='btn btn-secondary'
              onClick={handleGuestAccess}
            >
              Access as Guest
            </button>
         
          </div>
       
        </form>
     
      </div>
   
    </div>
  );
}

export default Login;

