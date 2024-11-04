import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from 'react-bootstrap';
import { useCategory } from './CategoryContext'; // Importar el hook del contexto
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function CategoryAdmin() {
    const { categories, fetchCategories } = useCategory(); // Obtener y establecer categorías desde el contexto
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [error, setError] = useState(''); // Estado para el error

    const navigate = useNavigate(); // Usar useNavigate para redirección

    // Verificar si el usuario tiene acceso a esta página
    useEffect(() => {
        const userRole = localStorage.getItem('userRole');  // Obtener el rol del usuario
        if (userRole !== '2' && userRole !== '3') { // Cambia estos valores según tus roles
            setError('No tienes acceso a esta página.');
            navigate('/');  // Redirigir al home si no es empleado ni administrador
        } else {
            fetchCategories(); // Llamar a la función solo si el usuario tiene acceso
        }
    }, [navigate, fetchCategories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prevState) => ({
            ...prevState,
            [name]: value,
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
            await axios.post('http://192.168.0.74/addCategory.php', newCategory);
            fetchCategories(); // Actualizar las categorías después de agregar
            setShowModal(false);
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleUpdateCategory = async () => {
        try {
            await axios.post('http://192.168.0.74/updateCategory.php', {
                id_category: currentCategoryId,
                name: newCategory.name,
            });
            fetchCategories(); // Actualizar las categorías después de editar
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
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.post('http://192.168.0.74/deleteCategory.php', { id_category });
                fetchCategories(); // Actualizar las categorías después de eliminar
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div id="root">
            <Header />
            <main className="container my-5">
                <h1>Category Management</h1>
                {error && <p className="text-danger">{error}</p>} {/* Mostrar mensaje de error si existe */}
                <Button variant="primary" onClick={handleShowModal}>
                    Add New Category
                </Button>
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id_category}>
                                    <td>{category.id_category}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteCategory(category.id_category)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Edit Category' : 'Add New Category'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCategory.name}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
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
