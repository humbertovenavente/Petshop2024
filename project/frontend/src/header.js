import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const userRole = parseInt(localStorage.getItem('userRole')) || 'guest';
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [searchResults, setSearchResults] = useState([]); // Estado para los resultados de búsqueda

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Obtener categorías desde category2.php
  useEffect(() => {
    fetch('http://192.168.0.74/category2.php')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleCategoryHover = (category) => {
    setActiveCategory(category);
  };

  // Función para manejar cambios en el campo de búsqueda
  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 2) { // Realizar la búsqueda solo si hay más de 2 caracteres
      try {
        const response = await fetch(`http://192.168.0.74/searchProducts.php?term=${term}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
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
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {/* Resultados de búsqueda */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((product) => (
                <div key={product.id_product} className="search-result-item">
                  <img
                    src={`data:${product.file_type};base64,${product.image}`}
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">Q{product.price}</p>
                    <Link to={`/ProductDetails/${product.id_product}`} className="view-product-button">Ver artículo</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="account-and-cart">
          <Link to={userRole === 'guest' ? '/login' : '/Account'} className="account-link">My Account</Link>
          {userRole !== 'guest' && <Link to="/MyOrders" className="order-link">My Orders</Link>}
          <Link to="/cart">
            <img src="https://img.icons8.com/ios-filled/50/000000/shopping-cart.png" alt="Shopping Cart" className="cart-icon" />
          </Link>
        </div>
      </header>

      <nav className="nav-bar">
        <Link to="/" className="nav-link">Home</Link>
        <div className="dropdown">
          <button className="nav-link dropdown-toggle" onClick={handleDropdownToggle}>
            Categories
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/Category">All Categories</Link></li>
              {categories.length > 0 && categories.map(category => (
                <li key={category.id_category || category.main_category_id} onMouseEnter={() => handleCategoryHover(category)}>
                  <Link to={`/category/${category.id_category || category.main_category_id}/${category.name}`}>
                    {category.name || 'Unnamed Category'}
                  </Link>
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
            <Link to="/HomeAdmin2" className="nav-link">Manage Home 2</Link>
            <Link to="/EditCategory" className="nav-link">Edit Category</Link>
            <Link to="/shipping-config">Shipping Cost</Link>

          </>
        )}
      </nav>
    </>
  );
}

export default Header;
