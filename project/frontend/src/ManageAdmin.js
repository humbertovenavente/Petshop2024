import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CategoryAdmin() { 

  const [categories, setCategories] = useState([]); // Array para almacenar categorías
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [newCategory, setNewCategory] = useState({
    name: '' // Solo necesitamos el nombre de la categoría
  });

  const navigate = useNavigate(); 

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');  
    if (userRole !== '2' && userRole !== '3') { 
        setError('Access Denied');
        navigate('/');  // Redirigir al home si no es empleado ni administrador
    } else {
        fetchCategories(); 
    }
}, [navigate, fetchCategories]); // Agregar fetchCategories aquí


  // Función para obtener las categorías desde el backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.14/category.php');
      console.log("Respuesta de la API:", response.data);
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("La respuesta no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  // Función para manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Función para abrir el modal para agregar
  const handleShowModal = () => {
    setNewCategory({
      name: '' // Limpiar el formulario
    });
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => setShowModal(false);

  // Función para agregar una nueva categoría
  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://192.168.0.14/addCategory.php', newCategory);
      console.log("Category added:", response.data);
      fetchCategories(); // Refrescar la lista de categorías después de agregar
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error to add category:", error);
    }
  };

  // Función para eliminar una categoría
  const handleDeleteCategory = async (id_category) => {
    if (window.confirm("Are you sure to delete this category?")) {
      try {
        const response = await axios.post('http://192.168.0.14/deleteCategory.php', { id_category });
        console.log("Category deleted:", response.data);
        fetchCategories(); // Refrescar la lista de categorías después de eliminar
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  useEffect(() => {
    fetchCategories(); // Llamar a la función al cargar el componente
  }, []);

  return (
    <div id="root">
      <Header />
      
      <main > 
      <div  className="container my-5">
        <h1>Category Admin</h1>

        <div className="account-profile">
          <button className="edit-profile-btn" onClick={handleShowModal}>Ad a new category</button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Ootions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map(category => (
                <tr key={category.id_category}>
                  <td>{category.id_category}</td>
                  <td>{category.name}</td>
                  <td>
                    <button className="delete-profile-btn" onClick={() => handleDeleteCategory(category.id_category)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No Category found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar nueva categoría */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add new Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={newCategory.name} onChange={handleInputChange} className="form-control" />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      </Modal>
      </main>

      <Footer />
    </div>
  );
}

export default CategoryAdmin;
