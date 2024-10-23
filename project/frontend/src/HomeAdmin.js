import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap'; // Importamos Modal
import Header from './header';
import Footer from './footer';
import axios from 'axios';

function HomeAdmin() {
    const [slider1, setSlider1] = useState(null);
    const [slider2, setSlider2] = useState(null);
    const [slider3, setSlider3] = useState(null);
    const [title1, setTitle1] = useState('');
    const [description1, setDescription1] = useState('');
    const [title2, setTitle2] = useState('');
    const [description2, setDescription2] = useState('');
    const [title3, setTitle3] = useState('');
    const [description3, setDescription3] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Nueva parte: manejo de categorías destacadas
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [savedCategories, setSavedCategories] = useState([]); // Inicializa como un arreglo vacío

    // Modal states
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await axios.get('http://172.16.71.159/getHome.php');
                const data = response.data;
                setSlider1(`data:image/jpeg;base64,${data.slider1}`);
                setSlider2(`data:image/jpeg;base64,${data.slider2}`);
                setSlider3(`data:image/jpeg;base64,${data.slider3}`);
                setTitle1(data.title1);
                setDescription1(data.description1);
                setTitle2(data.title2);
                setDescription2(data.description2);
                setTitle3(data.title3);
                setDescription3(data.description3);
            } catch (error) {
                console.error('Error fetching home data:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://172.16.71.159/category.php');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchSavedCategories = async () => {
            try {
                const response = await axios.get('http://172.16.71.159/getFeaturedCategories.php');
                const data = response.data || []; // Asegurarse de que sea un arreglo
                setSavedCategories(data);  // Guardar las categorías que ya están seleccionadas
                setSelectedCategories(data.map(category => category.id_category));  // Preseleccionar las categorías
            } catch (error) {
                console.error('Error fetching saved categories:', error);
            }
        };

        fetchHomeData();
        fetchCategories();
        fetchSavedCategories();  // Cargar las categorías destacadas ya guardadas
    }, []);

    const handleFileChange = (e, setSlider) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSlider(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);  // Convertir el archivo a base64
        }
    };

    const saveImage = async (field, imageData) => {
        setLoading(true);
        try {
            const response = await axios.post('http://172.16.71.159/updateHome.php', {
                field: field,
                slider: imageData.split(',')[1], // Solo la parte base64
            });
            if (response.data.error) {
                alert(`Error guardando ${field}: ${response.data.error}`);
            } else {
                alert(`${field} guardado correctamente`);
            }
        } catch (error) {
            console.error(`Error guardando ${field}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const saveText = async (field, value) => {
        setLoading(true);
        try {
            const response = await axios.post('http://172.16.71.159/updateHome.php', {
                field: field,
                text: value,
            });
            if (response.data.error) {
                alert(`Error guardando ${field}: ${response.data.error}`);
            } else {
                alert(`${field} guardado correctamente`);
            }
        } catch (error) {
            console.error(`Error guardando ${field}:`, error);
        } finally {
            setLoading(false);
        }
    };

    // Función para seleccionar hasta 5 categorías
    const toggleCategorySelection = (id_category) => {
        if (selectedCategories.includes(id_category)) {
            setSelectedCategories(selectedCategories.filter(id => id !== id_category));
        } else if (selectedCategories.length < 5) {
            setSelectedCategories([...selectedCategories, id_category]);
        }
    };

    const saveFeaturedCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://172.16.71.159/saveFeaturedCategories.php', { categories: selectedCategories });
            if (response.data.error) {
                alert('Error saving featured categories: ' + response.data.error);
            } else {
                alert('Featured categories saved successfully!');
                setSavedCategories(selectedCategories.map(id => categories.find(cat => cat.id_category === id)));  // Actualiza las categorías guardadas
                setShowModal(false);  // Cerrar el modal después de guardar
            }
        } catch (error) {
            console.error('Error saving featured categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="root">
            <Header /> 
            <main className="main">
                <h1>Admin Home Settings</h1>
                <div className="admin-container">
                    <div className="slider-section">
                        <h2>Slider 1</h2>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSlider1)} />
                        {slider1 && <img src={slider1} alt="Slider 1" className="preview-image" />}
                        <Button onClick={() => saveImage('slider1', slider1)} disabled={loading || !slider1}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Image 1'}
                        </Button>
                    </div>

                    <div className="slider-section">
                        <h2>Slider 2</h2>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSlider2)} />
                        {slider2 && <img src={slider2} alt="Slider 2" className="preview-image" />}
                        <Button onClick={() => saveImage('slider2', slider2)} disabled={loading || !slider2}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Image 2'}
                        </Button>
                    </div>

                    <div className="slider-section">
                        <h2>Slider 3</h2>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSlider3)} />
                        {slider3 && <img src={slider3} alt="Slider 3" className="preview-image" />}
                        <Button onClick={() => saveImage('slider3', slider3)} disabled={loading || !slider3}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Image 3'}
                        </Button>
                    </div>
                </div>

                <div className="text-section">
                    <h2>Text 1</h2>
                    <input value={title1} onChange={(e) => setTitle1(e.target.value)} placeholder="Title 1" />
                    <input value={description1} onChange={(e) => setDescription1(e.target.value)} placeholder="Description 1" />
                    <Button onClick={() => saveText('title1', title1)} disabled={loading || !title1}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Save Text 1'}
                    </Button>

                    <h2>Text 2</h2>
                    <input value={title2} onChange={(e) => setTitle2(e.target.value)} placeholder="Title 2" />
                    <input value={description2} onChange={(e) => setDescription2(e.target.value)} placeholder="Description 2" />
                    <Button onClick={() => saveText('title2', title2)} disabled={loading || !title2}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Save Text 2'}
                    </Button>

                    <h2>Text 3</h2>
                    <input value={title3} onChange={(e) => setTitle3(e.target.value)} placeholder="Title 3" />
                    <input value={description3} onChange={(e) => setDescription3(e.target.value)} placeholder="Description 3" />
                    <Button onClick={() => saveText('title3', title3)} disabled={loading || !title3}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Save Text 3'}
                    </Button>
                </div>

                {/* Nueva sección para seleccionar las categorías destacadas */}
                <div className="featured-categories-section">
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Select Featured Categories
                    </Button>

                    {/* Modal para seleccionar categorías */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Select up to 5 Featured Categories</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="category-list">
                                {categories.map((category) => (
                                    <div key={category.id_category}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id_category)}
                                            onChange={() => toggleCategorySelection(category.id_category)}
                                            disabled={!selectedCategories.includes(category.id_category) && selectedCategories.length >= 5}
                                        />
                                        <label>{category.name}</label>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={saveFeaturedCategories} disabled={selectedCategories.length === 0}>
                                {loading ? 'Saving...' : 'Save Featured Categories'}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Mostrar las categorías guardadas */}
                    <h3>Your Top Categories Are:</h3>
                    <ul>
                        {Array.isArray(savedCategories) && savedCategories.length > 0 ? (
                            savedCategories.map(category => (
                                <li key={category.id_category}>{category.name}</li>
                            ))
                        ) : (
                            <li>No categories selected yet</li>
                        )}
                    </ul>
                </div>
            </main>
            <Footer /> 
        </div>
    );
}

export default HomeAdmin;
