import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function CategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '' });

  // Función para obtener categorías del backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.131/category.php');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleShowModal = () => {
    setNewCategory({ name: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setNewCategory({ name: category.name });
    setCurrentCategoryId(category.id_category);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAddCategory = async () => {
    try {
      await axios.post('http://192.168.0.131/addCategory.php', newCategory);
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.post('http://192.168.0.131/updateCategory.php', { 
        id_category: currentCategoryId, 
        name: newCategory.name
      });
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateCategory();
    } else {
      handleAddCategory();
    }
  };

  const handleDeleteCategory = async (id_category) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.post('http://192.168.0.131/deleteCategory.php', { id_category });
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

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
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map(category => (
                  <tr key={category.id_category}>
                    <td>{category.id_category}</td>
                    <td>{category.name}</td>
                    <td>
                      <button className="edit-profile-btn" onClick={() => handleEditCategory(category)}>Edit</button>
                      <button className="delete-profile-btn" onClick={() => handleDeleteCategory(category.id_category)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
