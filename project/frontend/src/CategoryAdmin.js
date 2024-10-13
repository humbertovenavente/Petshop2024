import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function CategoryAdmin() {
  const [categories, setCategories] = useState([]); // Array para almacenar categorías
  const [selectedParentCategories, setSelectedParentCategories] = useState([]); // Array para categorías padre seleccionadas
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [isEditing, setIsEditing] = useState(false); // Estado para saber si estamos editando o agregando
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // Almacenar el ID de la categoría que se está editando
  const [newCategory, setNewCategory] = useState({
    name: '',
    parentCategories: []
  });

  // Función para obtener categorías del backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.131/category.php');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Manejar la selección de categorías padre (con checkboxes)
  const handleCheckboxChange = (e) => {
    const categoryId = e.target.value;
    setSelectedParentCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter(id => id !== categoryId); // Deseleccionar si ya estaba seleccionada
      } else {
        return [...prevSelected, categoryId]; // Agregar si no estaba seleccionada
      }
    });
  };

  // Abrir el modal para agregar una nueva categoría
  const handleShowModal = () => {
    setNewCategory({
      name: '',
      parentCategories: []
    });
    setSelectedParentCategories([]);
    setIsEditing(false); // Estamos agregando, no editando
    setShowModal(true);
  };

  // Abrir el modal para editar una categoría
  const handleEditCategory = (category) => {
    setNewCategory({
      name: category.name,
      parentCategories: category.parentCategories || []
    });
    setCurrentCategoryId(category.id_category); // Establecemos el ID de la categoría actual que se está editando
    setSelectedParentCategories(category.parentCategories || []); // Establecemos las categorías padre seleccionadas
    setIsEditing(true); // Estamos editando
    setShowModal(true); // Abrimos el modal
  };

  // Cerrar el modal
  const handleCloseModal = () => setShowModal(false);

  // Agregar una nueva categoría
  const handleAddCategory = async () => {
    try {
      await axios.post('http://192.168.0.131/addCategory.php', { 
        ...newCategory, 
        parentCategories: selectedParentCategories 
      });
      fetchCategories(); // Refrescamos la lista de categorías después de agregar
      setShowModal(false); // Cerramos el modal
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Actualizar una categoría existente
  const handleUpdateCategory = async () => {
    try {
      await axios.post('http://192.168.0.131/updateCategory.php', { 
        id_category: currentCategoryId, 
        name: newCategory.name,
        parentCategories: selectedParentCategories
      });
      fetchCategories(); // Refrescamos la lista de categorías después de actualizar
      setShowModal(false); // Cerramos el modal
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Guardar cambios (agregar o editar)
  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateCategory();
    } else {
      handleAddCategory();
    }
  };

  // Eliminar una categoría
  const handleDeleteCategory = async (id_category) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.post('http://192.168.0.131/deleteCategory.php', { id_category });
        fetchCategories(); // Refrescamos la lista de categorías después de eliminar
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  // Obtener las categorías cuando el componente se cargue
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div id="root">
      <Header />
      <main> 
      <div>
        <h1>Category Management</h1>

        <div className="account-profile">
          <button className="edit-profile-btn" onClick={handleShowModal}>Add New Category</button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Main Category</th> {/* Nueva columna para mostrar las categorías padre */}
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(categories) && categories.length > 0 ? (
    categories.map(category => (
      <tr key={category.id_category}>
        <td>{category.id_category}</td>
        <td>{category.name}</td>
        <td>{category.parent_names ? category.parent_names : 'This is a category'}</td> {/* Mostrar los nombres de las categorías padres */}
        <td>
          <button className="edit-profile-btn" onClick={() => handleEditCategory(category)}>Edit</button>
          <button className="delete-profile-btn" onClick={() => handleDeleteCategory(category.id_category)}>Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">No categories found</td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {/* Modal para agregar o editar una categoría */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Category Name</label>
              <input type="text" name="name" value={newCategory.name} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Parent Categories</label>
              {categories.map(cat => (
                <div key={cat.id_category}>
                  <input 
                    type="checkbox" 
                    value={cat.id_category} 
                    checked={selectedParentCategories.includes(cat.id_category)}
                    onChange={handleCheckboxChange} 
                  />
                  {cat.name}
                </div>
              ))}
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

export default CategoryAdmin;


