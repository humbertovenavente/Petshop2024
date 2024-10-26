import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [values, setValues] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    id_rol: '1'  // Rol por defecto
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Maneja la entrada del formulario y actualiza el estado
  const handleInput = (event) => {
    setValues({
      ...values, 
      [event.target.name]: event.target.value
    });
  };

  // Validar campos antes de enviar el formulario
  const validate = () => {
    let errors = {};
    if (!values.name) errors.name = "Name is required";
    if (!values.lastname) errors.lastname = "Lastname is required";
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    if (!values.confirmPassword) errors.confirmPassword = "Confirm your password";
    if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords do not match";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return; // Si no pasa la validación, no continúa

    setLoading(true);  // Mostrar loading mientras se envía la solicitud

    axios.post('http://192.168.0.16/signup.php', values, {
      withCredentials: true,  // Esto es necesario si envías cookies o credenciales
    })
    .then(res => {
      setLoading(false);
      const { data } = res;

      if (data.error) {
        setErrors({ email: data.error });  // Mostrar mensaje de error si el correo ya existe
      } else {
        alert('The user was created successfully. Check your email to verify your account.');
        navigate('/login');
      }
    })
    .catch(err => {
      setLoading(false);
      console.log("Error:", err);
      alert('Error occurred while trying to create the user');
    });
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange' }}>
      <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
          <h1>Sign up</h1>

          <div className='mb-3'>
            <label htmlFor='name'> Name </label>
            <input 
              type="text" 
              name='name' 
              placeholder='Enter name' 
              onChange={handleInput} 
              value={values.name} 
              className='form-control rounded-0'
              required
            />
            {errors.name && <p className="text-danger">{errors.name}</p>}
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
              required
            />
            {errors.lastname && <p className="text-danger">{errors.lastname}</p>}
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
              required
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}  
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
              required
            />
            {errors.password && <p className="text-danger">{errors.password}</p>}
          </div>

          <div className='mb-3'>
            <label htmlFor='confirmPassword'> Confirm Password </label>
            <input 
              type="password" 
              name='confirmPassword' 
              placeholder='Confirm password' 
              onChange={handleInput} 
              value={values.confirmPassword} 
              className='form-control rounded-0'
              required
            />
            {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
          </div>

          {loading ? (
            <div className="text-center">
              <p>Loading...</p>
            </div>
          ) : (
            <button type='submit' className='btn btn-success w-100'>
              Create an account
            </button>
          )}

          <p></p>
          <Link to="/Login" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Back</Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
