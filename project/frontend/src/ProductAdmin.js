import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    stock: '1',
    comment: '',
    color: '',
    size: '',
    image: '',
    file_type: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== '2' && userRole !== '3') {
      setError('No tienes acceso a esta página.');
      navigate('/');
    } else {
      fetchProducts();
      fetchCategories();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://172.16.69.227/product.php');
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://172.16.69.227/category.php');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value,
      stock: name === 'inventory' && parseInt(value) === 0 ? '0' : prevState.stock
    }));
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prevSelected =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter(id => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleShowModal = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      inventory: '',
      stock: '1',
      comment: '',
      color: '',
      size: '',
      image: '',
      file_type: '',
    });
    setSelectedCategories([]);
    setSelectedFile(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleShowCategoryModal = async (product) => {
    setCurrentProductId(product.id_product);
    try {
      const response = await axios.post('http://172.16.69.227/getProductCategories.php', {
        id_product: product.id_product,
      });
      if (Array.isArray(response.data)) {
        setSelectedCategories(response.data);
      } else {
        setSelectedCategories([]);
      }
    } catch (error) {
      console.error("Error fetching selected categories:", error);
    }
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => setShowCategoryModal(false);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveCategories = async () => {
    try {
      await axios.post('http://172.16.69.227/updateProductCat.php', {
        id_product: currentProductId,
        categories: selectedCategories,
      });
      alert('Categorías guardadas exitosamente.');
      fetchProducts(); // Refrescar la lista de productos para reflejar los cambios
      setShowCategoryModal(false); // Cerrar el modal de categorías
    } catch (error) {
      console.error("Error saving categories:", error);
      alert('Error al guardar las categorías.');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.inventory) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...newProduct,
        categories: selectedCategories,
        image: selectedFile,
        file_type: fileType
      };

      const response = await axios.post('http://172.16.69.227/addProduct.php', productData);

      if (response.data.error) {
        alert(`Error: ${response.data.error}`);
      } else {
        alert('Producto agregado exitosamente');
        fetchProducts();
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      setError('Error al agregar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      inventory: product.inventory,
      stock: product.inventory === 0 ? '0' : '1',
      comment: product.comment,
      color: product.color,
      size: product.size,
      image: product.image,
      file_type: product.file_type,
    });
    setCurrentProductId(product.id_product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      setLoading(true);

      const productData = {
        ...newProduct,
        categories: selectedCategories,
        image: selectedFile || newProduct.image,
        file_type: selectedFile ? fileType : newProduct.file_type
      };

      const response = await axios.post('http://172.16.69.227/updateProduct.php', { 
        id_product: currentProductId,
        ...productData
      });

      if (response.data.error) {
        console.error('Error al actualizar el producto:', response.data.error);
      } else {
        alert('Producto actualizado exitosamente');
        fetchProducts();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      setError('Error al actualizar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = async (id_product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await axios.post('http://172.16.69.227/deleteProduct.php', { id_product });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setError('Error al eliminar el producto.');
      } finally {
        setLoading(false);
      }
    }
    };
  
    return (
      <div id="root">
        <Header />
        <main>
          <div>
            <h1>Product Management</h1>
            {error && <p className="text-danger">{error}</p>}
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
                  <th>Image</th>
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
                        {product.image ? (
                          <img src={`data:${product.file_type};base64,${product.image}`} alt="Product" style={{ width: '50px', height: '50px' }} />
                        ) : 'No Image'}
                      </td>
                      <td>
                        <button className="edit-profile-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                        <button className="category-select-btn" onClick={() => handleShowCategoryModal(product)}>Select Category</button>
                        <button className="delete-profile-btn" onClick={() => handleDeleteProduct(product.id_product)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
  
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
                  <label>Color</label>
                  <input type="text" name="color" value={newProduct.color} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input type="text" name="size" value={newProduct.size} onChange={handleInputChange} className="form-control" />
                </div>
  
                {newProduct.image && (
                  <div className="form-group">
                    <label>Current Image</label>
                    <img src={`data:${newProduct.file_type};base64,${newProduct.image}`} alt="Current Product" style={{ width: '100px', height: '100px' }} />
                  </div>
                )}
  
                <div className="form-group">
                  <label>Upload New Image</label>
                  <input type="file" onChange={handleFileChange} className="form-control" />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveChanges}>
                {loading ? <Spinner animation="border" size="sm" /> : (isEditing ? 'Save Changes' : 'Add')}
              </Button>
            </Modal.Footer>
          </Modal>
  
          <Modal show={showCategoryModal} onHide={handleCloseCategoryModal}>
            <Modal.Header closeButton>
              <Modal.Title>Select Categories</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {categories.map(category => (
                <Button
                  key={category.id_category}
                  variant={selectedCategories.includes(category.id_category) ? "primary" : "outline-primary"}
                  onClick={() => toggleCategorySelection(category.id_category)}
                  className="m-1"
                >
                  {category.name}
                </Button>
              ))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseCategoryModal}>Close</Button>
              <Button variant="primary" onClick={handleSaveCategories}>Save</Button>
            </Modal.Footer>
          </Modal>
        </main>
        <Footer />
      </div>
    );
  }
  
  export default ProductAdmin;
  
