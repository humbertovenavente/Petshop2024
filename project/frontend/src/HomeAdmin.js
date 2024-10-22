import React, { useEffect, useState } from 'react';
import Header from './header';  // Header importado
import Footer from './footer';  // Footer importado
import axios from 'axios';
import { Spinner, Button } from 'react-bootstrap';

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

    // Cargar los datos al iniciar el componente
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const response = await axios.get('http://192.168.0.131/getHome.php');
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

        fetchHomeData();
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
            const response = await axios.post('http://192.168.0.131/updateHome.php', {
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
            const response = await axios.post('http://192.168.0.131/updateHome.php', {
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

    return (
        <div  id="root">
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
            </main>
            <Footer /> {/* Agregar Footer */}
        </div>
    );
}

export default HomeAdmin;
