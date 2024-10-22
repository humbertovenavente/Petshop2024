import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const userRole = parseInt(localStorage.getItem('userRole')) || 'guest';
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null); // Para submenús

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Obtener categorías desde category2.php
  useEffect(() => {
    fetch('http://192.168.0.131/category2.php')  // Cambia esta URL si es necesario
      .then(response => response.json())
      .then(data => {
        console.log('Categorías obtenidas:', data);
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleCategoryHover = (category) => {
    setActiveCategory(category);
  };

  // Función para eliminar categorías duplicadas
  const uniqueCategories = (relatedCategories) => {
    return relatedCategories.reduce((unique, category) => {
      if (!unique.some(item => item.name === category.name)) {
        unique.push(category);
      }
      return unique;
    }, []);
  };

  return (
    <>
      <header className="header">
        <div className="logo-and-search">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Logo" className="logo" />
          <input type="text" className="search-bar" placeholder="Search" />
        </div>

        <div className="account-and-cart">
          {userRole !== 'guest' && <Link to="/Account" className="account-link">My Account</Link>}
          {userRole !== 'guest' && <Link to="/MyOrders" className="order-link">My Orders</Link>}
          <Link to="/cart">
            <img src="https://img.icons8.com/ios-filled/50/000000/shopping-cart.png" alt="Shopping Cart" className="cart-icon" />
          </Link>
        </div>
      </header>

      <nav className="nav-bar">
        <Link to="/" className="nav-link">Home</Link>

        {/* Menú desplegable de Categorías */}
        <div className="dropdown">
          <button className="nav-link dropdown-toggle" onClick={handleDropdownToggle}>
            Categories
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              {/* Opción "All Categories" */}
              <li><Link to="/Category">All Categories</Link></li>

              {/* Renderizado dinámico de categorías con submenús */}
              {categories.length > 0 && categories.map(category => (
                <li key={category.id_category || category.main_category_id} onMouseEnter={() => handleCategoryHover(category)}>
                  <Link to={`/category/${category.id_category || category.main_category_id}/${category.name}`}>
                    {category.name || 'Unnamed Category'}
                  </Link>

                  {/* Submenú si la categoría tiene categorías relacionadas */}
                  {activeCategory === category && category.related_categories && (
                    <ul className="submenu">
                      {uniqueCategories(category.related_categories).map(relatedCategory => (
                        <li key={relatedCategory.id}>
                          <Link to={`/category/${relatedCategory.id}/${relatedCategory.name}`}>
                            {relatedCategory.name || 'Unnamed Related Category'}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {userRole >= 2 && (
          <>
            <Link to="/ManageOrder" className="nav-link">Manage Orders</Link>
            <Link to="/inventory" className="nav-link">Inventory</Link>
          </>
        )}

        {userRole === 3 && (
          <>
            <Link to="/UserAdmin" className="nav-link">Manage Users</Link>
            <Link to="/CategoryAdmin" className="nav-link">Manage Category</Link>
            <Link to="/ProductAdmin" className="nav-link">Manage Product</Link>
            <Link to="/HomeAdmin" className="nav-link">Manage Home</Link>
          </>
        )}
      </nav>
    </>
  );
}

export default Header;
