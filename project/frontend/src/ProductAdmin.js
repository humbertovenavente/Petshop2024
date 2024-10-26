import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Select from 'react-select';  // Import react-select
import { useNavigate } from 'react-router-dom';

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
    image: '', // Add this to store the current image
    file_type: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // To store the selected image
  const [fileType, setFileType] = useState(''); // To store the file type (MIME type)
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(''); // Agregar estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');  // Obtener el rol del usuario
    if (userRole !== '2' && userRole !== '3') { // Cambia estos valores según tus roles
        setError('No tienes acceso a esta página.'); // Establecer mensaje de error
        navigate('/');  // Redirigir al home si no es empleado ni administrador
    } else {
        fetchProducts(); // Llamar a la función solo si el usuario tiene acceso
        fetchCategories(); // Fetch available categories (tags)
    }
  }, [navigate]); // Aquí no es necesario incluir fetchProducts o fetchCategories, ya que no cambian

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.0.16/product.php');
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch categories (tags) from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.16/category.php');
      if (Array.isArray(response.data)) {
        setCategories(response.data.map(cat => ({ value: cat.id_category, label: cat.name }))); // Format categories for react-select
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle form input changes
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

  // Handle category selection (using react-select)
  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected.map(item => item.value));
  };

  // Open modal to add a new product
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
      image: '', // Clear image when adding a new product
      file_type: '',
    });
    setSelectedCategories([]); // Clear the selected categories
    setSelectedFile(null); // Clear selected file
    setIsEditing(false); // We're adding, not editing
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => setShowModal(false);

  // Add a new product
  const handleAddProduct = async () => {
    // Validación básica
    if (!newProduct.name || !newProduct.price || !newProduct.inventory) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);  // Iniciar el estado de carga

      // Agregar la imagen y el tipo de archivo si se selecciona
      const productData = {
        ...newProduct,
        categories: selectedCategories,  // Enviar las categorías seleccionadas
        image: selectedFile,  // Aquí se envía la imagen en Base64
        file_type: fileType  // El tipo de archivo de la imagen
      };

      const response = await axios.post('http://192.168.0.16/addProduct.php', productData);

      if (response.data.error) {
        alert(`Error: ${response.data.error}`);
      } else {
        alert('Producto agregado exitosamente');
        fetchProducts(); // Refrescar la lista de productos después de agregar
        setShowModal(false); // Cerrar el modal
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      setError('Error al agregar el producto.'); // Establecer mensaje de error
    } finally {
      setLoading(false);  // Finalizar el estado de carga
    }
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
      image: product.image, // Cargar la imagen actual
      file_type: product.file_type, // Cargar el tipo de archivo actual
    });
    setSelectedCategories(product.categories || []); // Establecemos las categorías seleccionadas
    setCurrentProductId(product.id_product); // Establecer el ID del producto que estamos editando
    setIsEditing(true); // Cambiamos el estado a "editando"
    setShowModal(true); // Mostramos el modal
  };

  // Function to update a product (Save Changes)
  const handleUpdateProduct = async () => {
    try {
      setLoading(true);  // Empezar loading
      const productData = {
        ...newProduct,
        categories: selectedCategories,
        image: selectedFile || newProduct.image, // Use the existing image if no new one is selected
        file_type: selectedFile ? fileType : newProduct.file_type // Use the existing file type if no new image
      };

      const response = await axios.post('http://192.168.0.16/updateProduct.php', { 
        id_product: currentProductId,  // Pasar el ID del producto que se está editando
        ...productData
      });

      if (response.data.error) {
        console.error('Error al actualizar el producto:', response.data.error);
      } else {
        alert('Producto actualizado exitosamente');
        fetchProducts(); // Actualizar la lista de productos
        setShowModal(false); // Cerrar el modal
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      setError('Error al actualizar el producto.'); // Establecer mensaje de error
    } finally {
      setLoading(false);  // Finalizar loading
    }
  };

  // Function to save changes (either add or edit)
  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateProduct();  // Llamar a la función de actualizar producto
    } else {
      handleAddProduct();  // Llamar a la función de agregar nuevo producto
    }
  };

  // Handle file change (upload image)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileType(file.type); // Set the file type (MIME type)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result); // Convertir la imagen a Base64
      };
      reader.readAsDataURL(file); // Convertir la imagen a Base64
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id_product) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);  // Start loading
        await axios.post('http://192.168.0.16/deleteProduct.php', { id_product });
        fetchProducts(); // Refresh the product list after deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        setError('Error al eliminar el producto.'); // Establecer mensaje de error
      } finally {
        setLoading(false);  // Stop loading
      }
    }
  };

  return (
    <div id="root">
      <Header />
      <main>
        <div>
          <h1>Product Management</h1>
          {error && <p className="text-danger">{error}</p>} {/* Mostrar mensaje de error si existe */}
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

              {/* Mostrar imagen actual si existe */}
              {newProduct.image && (
                <div className="form-group">
                  <label>Current Image</label>
                  <img src={`data:${newProduct.file_type};base64,${newProduct.image}`} alt="Current Product" style={{ width: '100px', height: '100px' }} />
                </div>
              )}

              {/* Campo para subir nueva imagen */}
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
      </main>

      <Footer />
    </div>
  );
}

export default ProductAdmin;
