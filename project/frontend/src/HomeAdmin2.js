import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

function HomeAdmin2() {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('http://172.16.71.159/getSettings.php');
                const { categories, limit } = response.data;
                setSelectedCategories(categories || []);
                setLimit(limit || 10);
            } catch (error) {
                console.error('Error fetching settings', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://172.16.71.159/category.php');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchSettings();
        fetchCategories();
    }, []);

    const toggleCategorySelection = (id_category) => {
        if (selectedCategories.includes(id_category)) {
            setSelectedCategories(selectedCategories.filter(id => id !== id_category));
        } else {
            setSelectedCategories([...selectedCategories, id_category]);
        }
    };

    const saveSettings = async () => {
        setLoading(true);
        try {
            await axios.post('http://172.16.71.159/saveSettings.php', {
                categories: selectedCategories,
                limit: limit
            });
            alert('Settings saved successfully!');
            setShowCategoryModal(false);
            setShowLimitModal(false);
        } catch (error) {
            console.error('Error saving settings', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="root">
            <Header /> 
            <main>
            <div className="container mt-4">
                <h1 className="mb-4">Admin Home Settings</h1>

                <Button variant="primary" onClick={() => setShowLimitModal(true)} className="me-2">
                    Select Limit of Products
                </Button>

                <Button variant="primary" onClick={() => setShowCategoryModal(true)}>
                    Select Featured Categories
                </Button>

                {/* Modal para seleccionar el límite de productos */}
                <Modal show={showLimitModal} onHide={() => setShowLimitModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Number of Products to Display</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Label>Number of products to display:</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={limit} 
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (  
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </Form.Control>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowLimitModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={saveSettings} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Limit'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para seleccionar las categorías */}
                <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Featured Categories</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="category-list">
                            {categories.map((category) => (
                                <div key={category.id_category}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id_category)}
                                        onChange={() => toggleCategorySelection(category.id_category)}
                                    />
                                    <label className="ms-2">{category.name}</label>
                                </div>
                            ))}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={saveSettings} disabled={selectedCategories.length === 0}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Featured Categories'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Mostrar las categorías seleccionadas */}
                <h3>Your Top Categories Are:</h3>
                <ul>
                    {selectedCategories.length > 0 ? (
                        selectedCategories.map(id => {
                            const category = categories.find(cat => cat.id_category === id);
                            return category ? <li key={id}>{category.name}</li> : null;
                        })
                    ) : (
                        <li>No categories selected yet</li>
                    )}
                </ul>

                {/* Mostrar el límite seleccionado */}
                <h3>Limit of Products Selected:</h3>
                <p>{limit}</p>
            </div>
            </main>
            <Footer /> {/* Integrar Footer */}
        </div>
    );
}

export default HomeAdmin2;
