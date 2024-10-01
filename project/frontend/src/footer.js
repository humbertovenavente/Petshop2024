import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();  
const userRole = localStorage.getItem('userRole');
  const handleLogout = () => {
    
    localStorage.clear();
    navigate('/');
  };

  return (
    <footer className="footer">
      <div className="container">
        <Link to="/about">About Us</Link>
        <Link to="/social">Social</Link>
        <Link to="/contact">Contact Us</Link>
        {userRole !== 'guest' && (
                  <button onClick={handleLogout} className="btn btn-link">Log Out</button>)}

      </div>
   

    </footer>
  );
}

export default Footer;

