import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const userRole = parseInt(localStorage.getItem('userRole')); 
  
  return (
    <>
      <header className="header">
        <div className="logo-and-search">
          {/* Logo */}
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Logo" className="logo" />
          {/* Search Bar */}
          <input type="text" className="search-bar" placeholder="Search" />
          
        </div>

        <div className="account-and-cart">
          {/* Mostrar "My Account" solo si el usuario no es un guest */}
          {userRole !== 'guest' && 
          
          <Link to="/Account" className="account-link">My Account</Link>}

          {/* Mostrar "My Order" solo si el usuario no es un guest */}
          {userRole !== 'guest' && 
          
          <Link to="/order" className="order-link">My Order</Link>}

          <img src="https://img.icons8.com/ios-filled/50/000000/shopping-cart.png" alt="Shopping Cart" className="cart-icon" />
        </div>
      </header>

      <nav className="nav-bar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/Category" className="nav-link">Categories</Link>

        {/* Funcionalidades adicionales solo para empleados y administradores */}
        {userRole >= 2 && (
          <>
            <Link to="/manage-orders" className="nav-link">Manage Orders</Link>
            <Link to="/inventory" className="nav-link">Inventory</Link>
          </>
        )}

        {/* Funcionalidades solo para administradores */}
        {userRole === 3 && (
          <>
            <Link to="/UserAdmin" className="nav-link">Manage Users</Link>
            <Link to="/CategoryAdmin" className="nav-link">Manage Category</Link>
            <Link to="/ProductAdmin" className="nav-link">Manage Product</Link>
          </>
        )}
      </nav>
    </>
  );
}

export default Header;
