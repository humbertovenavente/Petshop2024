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
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Top Products
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get('http://172.16.71.159/topSells.php');
        setTopProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos más vendidos', error);
      }
    };

    // Fetch Slider Data
    const fetchSliderData = async () => {
      try {
        const response = await axios.get('http://172.16.71.159/getHome.php');
        setSliderData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del slider', error);
      }
    };

    // Fetch Featured Categories
    const fetchFeaturedCategories = async () => {
      try {
        const response = await axios.get('http://172.16.71.159/getFeaturedCategories.php');
        setFeaturedCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías destacadas', error);
      }
    };

    // Fetch FAQs
    const fetchFaqData = async () => {
      try {
        const response = await axios.get('http://172.16.71.159/getFaq.php');
        setFaqData(response.data);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      }
    };

    fetchTopProducts();
    fetchSliderData();
    fetchFeaturedCategories();
    fetchFaqData();
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/ProductDetails/${productId}`);
  };

  const handleViewCategory = (categoryId) => {
    navigate(`/Category/${categoryId}`);
  };

  const featuredProducts = [
    { name: 'Producto A', price: '$100', image: sliderData.slider1 },
    { name: 'Producto B', price: '$150', image: sliderData.slider2 },
    { name: 'Producto C', price: '$200', image: sliderData.slider3 }
  ];

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
                <Card key={index} className="category-card" onClick={() => handleViewCategory(category.id_category)}>
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
          <h2>About Us Video</h2>
          <video controls style={{ width: '100%' }}>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
