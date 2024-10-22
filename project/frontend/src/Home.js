import React, { useState, useEffect } from 'react';
import { Card, Carousel, Button, Accordion } from 'react-bootstrap'; // Importa los componentes que faltaban
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VideoComponent from './VideoC'; // Asegúrate de tener este componente definido en tu proyecto
import Header from './header'; // Asegúrate de tener este componente definido
import Footer from './footer'; // Asegúrate de tener este componente definido
import './App.css';

// Función auxiliar para dividir los productos en grupos
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
    description3: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los productos más vendidos
    async function fetchTopProducts() {
      try {
        const response = await axios.get('http://192.168.0.131/topSells.php');
        setTopProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos más vendidos', error);
      }
    }
    fetchTopProducts();

    // Obtener los datos del slider
    async function fetchSliderData() {
      try {
        const response = await axios.get('http://192.168.0.131/getHome.php');
        setSliderData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del slider', error);
      }
    }
    fetchSliderData();
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/ProductDetails/${productId}`);
  };

  // Datos estáticos para 12 productos destacados (featured) en carrusel
  const featuredProducts = [
    { name: 'Producto Destacado A', price: '$120', image: sliderData.slider1 },
    { name: 'Producto Destacado B', price: '$150', image: sliderData.slider2 },
    { name: 'Producto Destacado C', price: '$200', image: sliderData.slider3 },
  ];

  // Datos estáticos para categorías destacadas
  const categories = [
    { name: 'Dog' },
    { name: 'Cat' },
    { name: 'Rabbit' },
    { name: 'Food' },
    { name: 'Bird' }
  ];

  // URL estática para el video de presentación
  const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';

  return (
    <div id="root">
      <Header />
      <main>
        {/* Slider/Carrusel en la parte superior */}
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

        {/* Productos más vendidos en 2 filas de 5 productos */}
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
                      <Button
                        variant="primary"
                        onClick={() => handleViewProduct(product.id_product)}
                      >
                        Ver Artículo
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Categorías destacadas */}
        <div className="category-section">
          <h2>Top Categories</h2>
          <div className="card-grid">
            {categories.map((category, index) => (
              <Card key={index} className="category-card">
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        {/* Productos Destacados Automáticos en Carrusel */}
        <div className="featured-products my-5">
          <h2>Featured Products</h2>
          <Carousel interval={3000} indicators={false}>
            {chunkArray(featuredProducts, 4).map((productGroup, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-around">
                  {productGroup.map((product, idx) => (
                    <Card key={idx} className="featured-product-card" style={{ width: '18rem' }}>
                      <Card.Img variant="top" src={product.image} alt={product.name} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>Price: {product.price}</Card.Text>
                        <Button variant="primary">See Item</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Acordeón */}
        <div className="accordion-section my-5">
          <h2>Frequently Asked Questions</h2>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>What is this store about?</Accordion.Header>
              <Accordion.Body>
                This store provides a wide range of products for your pets, including food, toys, and accessories.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How can I place an order?</Accordion.Header>
              <Accordion.Body>
                You can place an order by browsing our products, adding them to the cart, and proceeding with the checkout process.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Do you offer discounts?</Accordion.Header>
              <Accordion.Body>
                Yes, we offer discounts periodically. Keep an eye on our homepage for the latest deals!
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        {/* Video de presentación */}
        <div className="video-section">
          <h2>About Us Video</h2>
          <VideoComponent videoUrl={videoUrl} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
