import React, { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import axios from 'axios';

function Category() {
  const [categories, setCategories] = useState([]); // Array to store categories

  // Function to fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.11/category.php');
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch categories when component loads
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>   
      <Header />
      <div>
        <h1>Categories</h1>
        <ul>
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map(category => (
              <li key={category.id_category}>
                {category.name}
              </li>
            ))
          ) : (
            <li>No categories found</li>
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

export default Category;
