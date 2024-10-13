import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';  // Import react-select

function ProductAdmin() {
  const [products, setProducts] = useState([]); // Array to store products
  const [categories, setCategories] = useState([]); // Array to store categories (tags)
  const [selectedCategories, setSelectedCategories] = useState([]); // Store selected categories for each product
  const [showModal, setShowModal] = useState(false); // Modal control
  const [isEditing, setIsEditing] = useState(false); // Track whether we're editing or adding a product
  const [currentProductId, setCurrentProductId] = useState(null); // To store the current product ID being edited
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    stock: '1', // Stock will be '1' (in stock) or '0' (out of stock)
    comment: '',
    color: '',
    size: '',
  });

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.0.131/product.php');
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to fetch categories (tags) from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.131/category.php');
      if (Array.isArray(response.data)) {
        setCategories(response.data.map(cat => ({ value: cat.id_category, label: cat.name }))); // Format categories for react-select
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNewProduct(prevState => {
      const updatedProduct = {
        ...prevState,
        [name]: value,
      };

      // Actualizamos el stock según el valor del inventario
      if (name === 'inventory') {
        updatedProduct.stock = parseInt(value) === 0 ? '0' : '1'; // Si inventario es 0, el stock es 'Out of Stock'
      }

      return updatedProduct;
    });
  };

  // Function to handle category selection (using react-select)
  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected.map(item => item.value));
  };

  // Function to open the modal to add a new product
  const handleShowModal = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      inventory: '',
      stock: '1', // Default stock as "In Stock"
      comment: '',
      color: '',
      size: '',
    });
    setSelectedCategories([]); // Clear the selected categories
    setIsEditing(false); // We're adding, not editing
    setShowModal(true);
  };

  // Function to open the modal to edit a product
  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      inventory: product.inventory,
      stock: product.inventory === 0 ? '0' : '1', // Asignamos stock basado en el inventario
      comment: product.comment,
      color: product.color,
      size: product.size,
    });
    setCurrentProductId(product.id_product); // Set the current product ID being edited
    setSelectedCategories(product.categories || []); // Set the selected categories for this product
    setIsEditing(true); // We're editing
    setShowModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => setShowModal(false);

  // Function to add a new product
  const handleAddProduct = async () => {
    try {
      await axios.post('http://192.168.0.131/addProduct.php', { 
        ...newProduct, 
        categories: selectedCategories 
      });
      fetchProducts(); // Refresh the product list after adding
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Function to update a product
  const handleUpdateProduct = async () => {
    try {
      await axios.post('http://192.168.0.131/updateProduct.php', { 
        id_product: currentProductId, 
        ...newProduct,
        categories: selectedCategories
      });
      fetchProducts(); // Refresh the product list after updating
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Function to save changes (either add or edit)
  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  // Function to delete a product
  const handleDeleteProduct = async (id_product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.post('http://192.168.0.131/deleteProduct.php', { id_product });
        fetchProducts(); // Refresh the product list after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Fetch products and categories when component loads
  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch available categories (tags)
  }, []);

  return (
    <div id="root">
      <Header />
      <main>
      <div>
        <h1>Product Management</h1>

        <div className="account-profile">
          <button className="edit-profile-btn" onClick={handleShowModal}>Add New Product</button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Categories</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map(product => (
                <tr key={product.id_product}>
                  <td>{product.id_product}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.inventory}</td>
                  <td>{Array.isArray(product.categories) ? product.categories.join(', ') : 'No categories'}</td>
                  <td>
                    <button className="edit-profile-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                    <button className="delete-profile-btn" onClick={() => handleDeleteProduct(product.id_product)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding or editing a product */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Inventory</label>
              <input type="number" name="inventory" value={newProduct.inventory} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <select className="form-control" name="stock" onChange={handleInputChange} value={newProduct.stock} disabled={parseInt(newProduct.inventory) === 0}>
                <option value="1">In Stock</option>
                <option value="0">Out of Stock</option>
              </select>
            </div>

            <div className="form-group">
              <label>Categories (Tags)</label>
              <Select
                options={categories} // Categories for the dropdown
                isMulti
                value={categories.filter(category => selectedCategories.includes(category.value))}
                onChange={handleCategoryChange}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <input type="text" name="color" value={newProduct.color} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Size</label>
              <input type="text" name="size" value={newProduct.size} onChange={handleInputChange} className="form-control" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            {isEditing ? 'Save Changes' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
      </main>

      <Footer />
    </div>
  );
}

export default ProductAdmin;



