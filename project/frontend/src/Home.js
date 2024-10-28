import React, { useState, useEffect } from 'react';
import { Accordion, Carousel, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import './App.css';

const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};
function Home() {
    const [topProducts, setTopProducts] = useState([]);
    const [sliderData, setSliderData] = useState({
        slider1: '',
        slider2: '',
        slider3: '',
        title1: '',
        description1: '',
        title2: '',
        description2: '',
        title3: '',
        description3: ''
    });
    const [featuredCategories, setFeaturedCategories] = useState([]);
    const [faqData, setFaqData] = useState([]);
    const [videoUrl, setVideoUrl] = useState(''); // Estado para el enlace del video
    const [videoName, setVideoName] = useState(''); // Estado para el nombre del video
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

        const getGridClass = (count) => {
        switch (count) {
            case 3:
                return 'grid-three';
            case 4:
                return 'grid-four';
            case 5:
                return 'grid-five';
            case 6:
                return 'grid-six';
            case 7:
                return 'grid-seven';
            case 8:
                return 'grid-eight';
            case 9:
                return 'grid-nine';
            case 10:
                return 'grid-ten';
            default:
                return 'grid-default';
        }
    };
     

    useEffect(() => {

        const fetchTopProducts2 = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getTopAllSells.php');
                if (response.data && Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    console.error('No se obtuvieron productos válidos');
                }
            } catch (error) {
                console.error('Error fetching top-selling products:', error);
            }
        };

               // Función para aplicar clases de grid según el número de productos

        const fetchTopProducts = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/topSells.php');
                setTopProducts(response.data);
            } catch (error) {
                console.error('Error al obtener los productos más vendidos', error);
            }
        };
        const fetchSliderData = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getHome.php');
                setSliderData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos del slider', error);
            }
        };
        const fetchFeaturedCategories = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getFeaturedCategories.php');
                setFeaturedCategories(response.data);
            } catch (error) {
                console.error('Error al obtener las categorías destacadas', error);
            }
        };
        const fetchFaqData = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getFaq.php');
                setFaqData(response.data);
            } catch (error) {
                console.error('Error fetching FAQ data:', error);
            }
        };
        const fetchVideoData = async () => {
            try {
                const response = await axios.get('http://192.168.0.16/getHomeVideo.php');
                console.log(response.data); // Muestra la respuesta en la consola para depuración
                // Verifica que response.data sea un array y tenga elementos
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const videoData = response.data[0]; // Asumiendo que solo quieres el primer video
                    if (videoData) {
                        setVideoUrl(videoData.video_link); // Asigna el enlace del video
                        setVideoName(videoData.name); // Asigna el nombre del video
                    } else {
                        console.error('Video no encontrado');
                    }
                } else {
                    console.error('La respuesta no contiene videos válidos:', response.data);
                }
            } catch (error) {
                console.error('Error al obtener el video:', error);
            }
        };
        
        
        fetchTopProducts2();
        fetchTopProducts();
        fetchSliderData();
        fetchFeaturedCategories();
        fetchFaqData();
        fetchVideoData(); // Obtener los datos del video
    }, []);

    const handleViewProduct = (productId) => {
        navigate(`/ProductDetails/${productId}`);
    };
    const handleViewCategory = (categoryId, categoryName) => {
        navigate(`/category/${categoryId}/${categoryName}`);
    };
    return (
        <div id="root">
            <Header />
            <main>
                {/* Slider Section */}
                <Carousel className="mb-5">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={`data:image/jpeg;base64,${sliderData.slider1}`}
                            alt="First slide"
                            style={{ height: '300px', objectFit: 'cover' }}
                        />
                        <Carousel.Caption>
                            <h3>{sliderData.title1}</h3>
                            <p>{sliderData.description1}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={`data:image/jpeg;base64,${sliderData.slider2}`}
                            alt="Second slide"
                            style={{ height: '300px', objectFit: 'cover' }}
                        />
                        <Carousel.Caption>
                            <h3>{sliderData.title2}</h3>
                            <p>{sliderData.description2}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={`data:image/jpeg;base64,${sliderData.slider3}`}
                            alt="Third slide"
                            style={{ height: '300px', objectFit: 'cover' }}
                        />
                        <Carousel.Caption>
                            <h3>{sliderData.title3}</h3>
                            <p>{sliderData.description3}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
                {/* Top Products Section */}
                <div className="product-list">
                    <h2>The Best-Selling Products</h2>
                    <div className="row">
                        {chunkArray(topProducts, 5).map((productGroup, index) => (
                            <div className="d-flex justify-content-around mb-4" key={index}>
                                {productGroup.map((product, idx) => (
                                    <Card key={idx} className="product-card" style={{ width: '18rem' }}>
                                        <Card.Img
                                            variant="top"
                                            src={`data:image/jpeg;base64,${product.image}`}
                                            alt={product.name}
                                            style={{ objectFit: 'cover', height: '300px', width: '100%' }}
                                        />
                                        <Card.Body>
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Text>Precio: {product.price}</Card.Text>
                                            <Button variant="primary" onClick={() => handleViewProduct(product.id_product)}>
                                                Ver Artículo
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Top Categories Section */}
                <div className="category-section">
                    <h2>Top Categories</h2>
                    <div className="card-grid">
                        {featuredCategories.length > 0 ? (
                            featuredCategories.map((category, index) => (
                                <Card key={index} className="category-card" onClick={() => handleViewCategory(category.id_category, category.name)}>
                                    <Card.Body>
                                        <Card.Title>{category.name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>No hay categorías destacadas seleccionadas.</p>
                        )}
                    </div>
                </div>
                  {/*TOP PRODUCTS BY CATEGORY */}
                <h1>Top Selling Products</h1>
                <div className={`product-grid ${getGridClass(products.length)}`}>
                    {products.map((product) => (
                        <div key={product.id_product} className="product-card">
                            <img 
                                src={`data:image/jpeg;base64,${product.image}`} 
                                alt={product.name} 
                                className="product-image"
                            />
                            <h3>{product.name}</h3>
                            <p>Precio: {product.price}</p>
                            <p>Inventario: {product.inventory}</p> {/* Mostrando el inventario */}
                            <Button variant="primary" onClick={() => handleViewProduct(product.id_product)}>
                                                Ver Artículo
                                            </Button>
                        </div>
                    ))}
                </div>
                {/* Accordion (FAQs) Section */}
                <div className="accordion-section my-5">
                    <h2>Frequently Asked Questions</h2>
                    <Accordion defaultActiveKey="0">
                        {faqData.map((faq, index) => (
                            <Accordion.Item eventKey={index.toString()} key={faq.id}>
                                <Accordion.Header>{faq.question}</Accordion.Header>
                                <Accordion.Body>{faq.answer}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
               {/* Video Section */}
<div className="video-section">
    <h2>{videoName ? `Video: ${videoName}` : 'About Us Video'}</h2>
    {videoUrl ? (
        <iframe
            width="100%"
            height="600"
            src={videoUrl}  // usar videoUrl directamente ya que es un enlace de incrustación
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Embedded Video"
        ></iframe>
    ) : (
        <p>No hay video disponible.</p>
    )}
</div>

            </main>
            <Footer />
        </div>
    );
}
export default Home;