import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
    const userRole = parseInt(localStorage.getItem('userRole')) || 'guest';
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null); 

    const handleDropdownToggle = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        // Obtener categorías desde el backend
        fetch('http://192.168.0.131/category2.php')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleCategoryHover = (category) => {
        setActiveCategory(category);
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

                <div className="dropdown">
                    <button className="nav-link dropdown-toggle" onClick={handleDropdownToggle}>
                        Categories
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li><Link to="/Category">All Categories</Link></li>

                            {categories.map(category => (
                                <li key={category.main_category_id} onMouseEnter={() => handleCategoryHover(category)}>
                                    <Link to={`/category/${category.main_category_id}/${category.main_category_name}`}>
                                        {category.main_category_name}
                                    </Link>

                                    {activeCategory === category && category.related_categories && (
                                        <ul className="submenu">
                                            {category.related_categories.map(related => (
                                                <li key={related.id}>
                                                    <Link to={`/category/${category.main_category_id}/related/${related.id}`}>
                                                        {related.name}
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
            </nav>
        </>
    );
}

export default Header;
