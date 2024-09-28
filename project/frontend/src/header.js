import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Logo" style={{ width: '40px' }} />
      </div>
      <div className="search-bar">
        <input type="text" className="form-control mx-3" placeholder="Search" />
      </div>
      <div className="links">
        <Link to="/account" className="mx-2">My Account</Link>
        <Link to="/order" className="mx-2">My Order</Link>
      </div>
    </header>
  );
}

export default Header;

