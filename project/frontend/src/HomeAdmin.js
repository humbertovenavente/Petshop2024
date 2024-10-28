import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
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
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [savedCategories, setSavedCategories] = useState([]);
    // FAQ states
    const [faqData, setFaqData] = useState([]);
    const [currentFaq, setCurrentFaq] = useState({ id: null, question: '', answer: '' });
    const [showFaqModal, setShowFaqModal] = useState(false);
    // Modal for categories
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    // Video states
    const [videoLink, setVideoLink] = useState('');
    const [newVideoLink, setNewVideoLink] = useState('');
    const [videoList, setVideoList] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVideoName, setSelectedVideoName] = useState('');
    const [selectedVideoToShow, setSelectedVideoToShow] = useState('');
    const [showVideoModal, setShowVideoModal] = useState(false);
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getHome.php');
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
                const response = await axios.get('http://192.168.0.16/category.php');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        const fetchSavedCategories = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getFeaturedCategories.php');
                const data = response.data || [];
                setSavedCategories(data);
                setSelectedCategories(data.map(category => category.id_category));
            } catch (error) {
                console.error('Error fetching saved categories:', error);
            }
        };
        const fetchFaqData = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getFaq.php');
                setFaqData(response.data || []);
            } catch (error) {
                console.error('Error fetching FAQ data:', error);
            }
        };
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getVideo.php');
                setVideoList(response.data);
                if (response.data.length > 0) {
                    setVideoLink(response.data[0].video_link);
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchHomeData();
        fetchCategories();
        fetchSavedCategories();
        fetchFaqData();
        fetchVideos();
    }, []);
    const handleFileChange = (e, setSlider) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSlider(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const saveImage = async (field, imageData) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.16/updateHome.php', {
                field: field,
                slider: imageData.split(',')[1],
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
            const response = await axios.post('http://192.168.0.16/updateHome.php', {
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
            const response = await axios.post('http://192.168.0.16/saveFeaturedCategories.php', { categories: selectedCategories });
            if (response.data.error) {
                alert('Error saving featured categories: ' + response.data.error);
            } else {
                alert('Featured categories saved successfully!');
                setSavedCategories(selectedCategories.map(id => categories.find(cat => cat.id_category === id)));
                setShowCategoryModal(false);
            }
        } catch (error) {
            console.error('Error saving featured categories:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleAddFaq = () => {
        setCurrentFaq({ id: null, question: '', answer: '' });
        setShowFaqModal(true);
    };
    const handleEditFaq = (faq) => {
        setCurrentFaq(faq);
        setShowFaqModal(true);
    };
    const handleSaveFaq = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.16/updateFaq.php', currentFaq);
            if (response.data.success) {
                alert('FAQ updated successfully');
                setShowFaqModal(false);
                if (currentFaq.id) {
                    setFaqData(faqData.map(f => (f.id === currentFaq.id ? currentFaq : f)));
                } else {
                    setFaqData([...faqData, response.data.newFaq]);
                }
            } else {
                alert('Error updating FAQ: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error updating FAQ:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteFaq = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
        if (!confirmDelete) return;
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.16/deleteFaq.php', { id });
            if (response.data.success) {
                alert('FAQ deleted successfully');
                setFaqData(faqData.filter(f => f.id !== id));
            } else {
                alert('Error deleting FAQ: ' + response.data.error);
            }
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        } finally {
            setLoading(false);
        }
    };
    const extractVideoEmbedLink = (url) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtube.com')
                ? url.split('v=')[1].split('&')[0]
                : url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes('vimeo.com')) {
            const videoId = url.split('/').pop().split('?')[0];
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return null;
    };
    
    const handleUpdateVideo = async () => {
        setLoading(true);
        try {
            if (!newVideoLink || !selectedVideoName) {
                alert("Por favor selecciona un video y proporciona un nuevo enlace válido");
                setLoading(false);
                return;
            }
            const embedLink = extractVideoEmbedLink(newVideoLink);
            if (!embedLink) {
                alert("Enlace de video inválido");
                setLoading(false);
                return;
            }
            const response = await axios.post('http://192.168.0.16/updateVideo.php', {
                video_link: embedLink,
                name: selectedVideoName
            });
            if (response.data.error) {
                alert(`Error actualizando el video: ${response.data.error}`);
            } else {
                alert('Video actualizado correctamente');
                setVideoLink(embedLink);
                setVideoList(
                    videoList.map((video) =>
                        video.name === selectedVideoName ? { ...video, video_link: embedLink } : video
                    )
                );
            }
        } catch (error) {
            console.error('Error actualizando el video:', error);
        } finally {
            setLoading(false);
            setShowEditModal(false);
        }
    };
    const handleShowSelectedVideo = async () => {
        const selectedVideo = videoList.find((video) => video.name === selectedVideoToShow);
        if (selectedVideo) {
            setVideoLink(selectedVideo.video_link);
            try {
                await axios.post('http://192.168.0.16/updateHomeVideo.php', {
                    video_link: selectedVideo.video_link
                });
            } catch (error) {
                console.error('Error actualizando el video en Home:', error);
            }
        }
        setShowVideoModal(false);
    };
    return (
        <div id="root">
            <Header />
            <main className="main">
                <h1>Admin Home Settings</h1>
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
                <div className="featured-categories-section">
                    <Button variant="primary" onClick={() => setShowCategoryModal(true)}>
                        Select Featured Categories
                    </Button>
                    <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
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
                            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={saveFeaturedCategories} disabled={selectedCategories.length === 0}>
                                {loading ? 'Saving...' : 'Save Featured Categories'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
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
                <div className="faq-section">
                    <h2>Manage FAQs</h2>
                    <Button variant="success" onClick={handleAddFaq}>Add FAQ</Button>
                    <ul>
                        {faqData.length > 0 ? faqData.map((faq) => (
                            faq && faq.question && faq.answer ? (
                                <li key={faq.id}>
                                    <strong>{faq.question}</strong> - {faq.answer}
                                    <Button onClick={() => handleEditFaq(faq)} style={{ marginLeft: '10px' }}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDeleteFaq(faq.id)} style={{ marginLeft: '10px' }}>Delete</Button>
                                </li>
                            ) : null
                        )) : <li>No FAQs available</li>}
                    </ul>
                </div>
                <Modal show={showFaqModal} onHide={() => setShowFaqModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{currentFaq.id ? 'Edit FAQ' : 'Add FAQ'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            type="text"
                            value={currentFaq.question}
                            onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                            placeholder="Question"
                        />
                        <textarea
                            value={currentFaq.answer}
                            onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                            placeholder="Answer"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowFaqModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleSaveFaq} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Video Section */}
                <div className="video-section">
                    <h2>Video Actual</h2>
                    {videoLink ? (
                        <iframe
                            width="100%"
                            height="600"
                            src={videoLink}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title="Embedded Video"
                        ></iframe>
                    ) : (
                        <p>No hay video disponible.</p>
                    )}
                </div>
                <Button onClick={() => setShowEditModal(true)}>Actualizar Video Existente</Button>
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar Video</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <select value={selectedVideoName} onChange={(e) => setSelectedVideoName(e.target.value)}>
                            <option value="">Selecciona un video</option>
                            {videoList.map((video) => (
                                <option key={video.id} value={video.name}>
                                    {video.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={newVideoLink}
                            onChange={(e) => setNewVideoLink(e.target.value)}
                            placeholder="Nuevo enlace del video"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={handleUpdateVideo} disabled={loading || !selectedVideoName}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Actualizar Video'}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Button onClick={() => setShowVideoModal(true)}>Mostrar Video</Button>
                <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Seleccionar Video para Mostrar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <select value={selectedVideoToShow} onChange={(e) => setSelectedVideoToShow(e.target.value)}>
                            <option value="">Selecciona un video</option>
                            {videoList.map((video) => (
                                <option key={video.id} value={video.name}>
                                    {video.name}
                                </option>
                            ))}
                        </select>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={handleShowSelectedVideo} disabled={!selectedVideoToShow}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Mostrar Video'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
            <Footer />
        </div>
    );
}
export default HomeAdmin;
