import React from 'react'
import { Link } from 'react-router-dom'

function Signup() {
  return (
    <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'darkorange'}}> 
    <div className='bg-white p-3 rounded w-25'>
      <form action="">
      <p>Sign up</p>

        <div className='mb-3'>
          <label htmlFor='email'> Email </label>
          <input type="email"placeholder='Enter email' className='form-control rounded-0'></input>
        </div>

        <div className='mb-3'>
          <label htmlFor='password'> Password </label>
          <input type="password" placeholder='Enter password' className='form-control rounded-0'></input>
        </div>
        <button className='btn btn-success w-100' > Create an account</button>
      <p></p>
      <Link to="/" className='btn btn-default border w-100 gb-light rounded-0 text-decoration-none'>Back</Link>
      
      </form>
    </div>
  </div>  )
}

export default Signup