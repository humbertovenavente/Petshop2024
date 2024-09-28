import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/about-us" className="mx-2">About Us</Link>
        <Link to="/social" className="mx-2">Social</Link>
        <Link to="/contact-us" className="mx-2">Contact Us</Link>
      </div>
    </footer>
  );
}

export default Footer;

