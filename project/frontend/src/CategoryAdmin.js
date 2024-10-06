import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function CategoryAdmin() {

  const [categories, setCategories] = useState([]); // Array to store categories
  const [showModal, setShowModal] = useState(false); // Modal control
  const [isEditing, setIsEditing] = useState(false); // State to track if we're editing or adding
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // Store the ID of the category being edited
  const [newCategory, setNewCategory] = useState({
    name: '' // Only need the category name
  });

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

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to open the modal to add a new category
  const handleShowModal = () => {
    setNewCategory({
      name: '' // Clear form input
    });
    setIsEditing(false); // We're not editing, we're adding
    setShowModal(true);
  };

  

   // Function to open the modal to edit a category
   const handleEditCategory = (category) => {
    setNewCategory({
      name: category.name // Load the selected category's name into the input
    });
    setCurrentCategoryId(category.id_category); // Store the ID of the category being edited
    setIsEditing(true); // We're editing
    setShowModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => setShowModal(false);

  // Function to add a new category
  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://192.168.0.11/addCategory.php', newCategory);
      console.log("Category added:", response.data);
      fetchCategories(); // Refresh category list after adding
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

   // Function to update a category
   const handleUpdateCategory = async () => {
    try {
      const response = await axios.post('http://192.168.0.11/updateCategory.php', { 
        id_category: currentCategoryId, 
        name: newCategory.name 
      });
      console.log("Category updated:", response.data);
      fetchCategories(); // Refresh category list after updating
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Function to save changes (either add or edit)
  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateCategory();
    } else {
      handleAddCategory();
    }
  };

  // Function to delete a category
  const handleDeleteCategory = async (id_category) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.post('http://192.168.0.11/deleteCategory.php', { id_category });
        console.log("Category deleted:", response.data);
        fetchCategories(); // Refresh category list after deletion
      } catch (error) {
        console.error("Error deleting category:", error);
      }
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
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map(category => (
                <tr key={category.id_category}>
                  <td>{category.id_category}</td>
                  <td>{category.name}</td>
                  <td>
                  <button className="delete-profile-btn" onClick={() => handleEditCategory(category)}>Edit</button>
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

      {/* Modal for adding a new category */}
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
          {isEditing ? 'Save Changes' : 'Add'} </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default CategoryAdmin;
