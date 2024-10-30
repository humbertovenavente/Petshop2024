// EditCategory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Tabs, Tab, Dropdown } from 'react-bootstrap'; // Asegurarse de que Dropdown esté importado
import Header from './header';
import Footer from './footer';

function EditCategory() {
    const [categories, setCategories] = useState([]);
    const [categoryDescriptions, setCategoryDescriptions] = useState({});
    const [section, setSection] = useState(1); // Estado para el número de secciones
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);

    // Obtener categorías, descripciones y sección guardada al montar el componente
    useEffect(() => {
        axios.get('http://192.168.0.16/getSelectedCategories.php')
            .then(response => {
                const descriptions = {};
                const initialSelectedCategories = [];
                let initialSection = 1;

                response.data.forEach(category => {
                    descriptions[category.id_category] = category.description || '';
                    if (category.selected) {
                        initialSelectedCategories.push(category.id_category);
                    }
                    initialSection = category.section || 1;
                });

                setCategories(response.data);
                setCategoryDescriptions(descriptions);
                setSelectedCategories(initialSelectedCategories);
                setSection(initialSection);
            })
            .catch(error => {
                console.error("Error al cargar categorías: ", error);
            });
    }, []);

    // Guardar la selección de categorías y el número de secciones en el backend
    const saveSelectedCategories = () => {
        axios.post('http://192.168.0.16/saveCategory.php', {
            selectedCategories: selectedCategories,
            section: section
        })
        .then(response => {
            console.log(response.data.message || "Selección de categorías guardada exitosamente");
            alert("Selección de categorías guardada exitosamente.");
        })
        .catch(error => {
            console.error("Error al guardar selección de categorías: ", error);
        });
    };

    // Guardar descripciones de categorías en el backend
    const saveDescriptions = () => {
        categories.forEach(category => {
            const description = categoryDescriptions[category.id_category] || '';
            axios.post('http://192.168.0.16/updateCategory2.php', {
                id_category: category.id_category,
                description: description
            })
            .then(response => {
                console.log(response.data.message || "Descripción actualizada exitosamente");
            })
            .catch(error => {
                console.error("Error al actualizar descripción: ", error);
            });
        });
        alert("Descripciones guardadas exitosamente.");
        setShowDescriptionModal(false);
    };

    // Lógica para seleccionar categorías hasta el límite de `section`
    const handleCategorySelect = (id_category) => {
        setSelectedCategories(prevSelected => {
            if (prevSelected.includes(id_category)) {
                return prevSelected.filter(id => id !== id_category);
            } else if (prevSelected.length < section) {
                return [...prevSelected, id_category];
            } else {
                alert(`Solo puedes seleccionar hasta ${section} categorías.`);
                return prevSelected;
            }
        });
    };

    return (
        <div>
            <Header />
            <main className="container my-5">
                <h1>Edit Categories</h1>

                {/* Botones para abrir los modales */}
                <Button variant="primary" onClick={() => setShowCategoryModal(true)} className="mb-3">
                    Select Categories
                </Button>
                <Button variant="primary" onClick={() => setShowSectionModal(true)} className="mb-3 ml-2">
                    Select Number of Sections
                </Button>
                <Button variant="primary" onClick={() => setShowDescriptionModal(true)} className="mb-3 ml-2">
                    Update Descriptions
                </Button>

                {/* Modal de selección de categorías */}
                <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Categories</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {categories.map(category => (
                            <Form.Check
                                key={category.id_category}
                                type="checkbox"
                                label={category.name}
                                checked={selectedCategories.includes(category.id_category)}
                                onChange={() => handleCategorySelect(category.id_category)}
                            />
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => {
                            saveSelectedCategories();
                            setShowCategoryModal(false); // Cierra el modal después de guardar
                        }}>
                            Save Selection
                        </Button>
                        <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal de selección del número de secciones */}
                <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Number of Sections</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Dropdown onSelect={(e) => setSection(parseInt(e))}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {section} Sections
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <Dropdown.Item key={num} eventKey={num}>{num} Sections</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSectionModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para actualizar descripciones */}
                <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Descriptions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {categories.map(category => (
                                <Form.Group key={category.id_category} controlId={`description-${category.id_category}`}>
                                    <Form.Label>{category.name}</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={categoryDescriptions[category.id_category] || ''}
                                        onChange={(e) => setCategoryDescriptions({
                                            ...categoryDescriptions,
                                            [category.id_category]: e.target.value
                                        })}
                                    />
                                </Form.Group>
                            ))}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={saveDescriptions}>
                            Save Descriptions
                        </Button>
                        <Button variant="secondary" onClick={() => setShowDescriptionModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Pestañas dinámicas para mostrar las categorías seleccionadas */}
                <div className="mt-5">
                    <h3>Dynamic Tabs</h3>
                    <Tabs defaultActiveKey={selectedCategories[0] || ''} id="category-tabs">
                        {selectedCategories.slice(0, section).map((id_category) => {
                            const category = categories.find(cat => cat.id_category === id_category);
                            return (
                                <Tab eventKey={id_category} title={category ? category.name : 'Section'} key={id_category}>
                                    <div className="p-3">
                                        <h4>{category ? category.name : 'No category selected'}</h4>
                                        <p>{categoryDescriptions[id_category]}</p>
                                    </div>
                                </Tab>
                            );
                        })}
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default EditCategory;
