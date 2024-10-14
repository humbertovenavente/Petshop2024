import React from 'react';
import { Card, Carousel, Button, Accordion } from 'react-bootstrap';
import VideoComponent from './VideoC';
import Header from './header';
import Footer from './footer';

// Importa las imágenes locales
import image1 from './assets/image1.jpeg';  // Asumiendo que tu imagen se llama 'image1.jpeg'

function Home() {
  // Datos estáticos para los 10 productos más vendidos con imágenes reales
  const topProducts = [
    { name: 'Perro', price: '$120', image: image1, categories: ['Cat1', 'Cat2'] },
    { name: 'Producto B', price: '$140', image: image1, categories: ['Cat1', 'Cat3'] },
    { name: 'Producto C', price: '$160', image: image1, categories: [] },
    { name: 'Producto D', price: '$180', image: image1, categories: ['Cat2'] },
    { name: 'Producto E', price: '$200', image: image1 },  
    { name: 'Producto F', price: '$220', image: image1, categories: ['Cat4'] },
    { name: 'Producto G', price: '$240', image: image1 },
    { name: 'Producto H', price: '$260', image: image1, categories: ['Cat1'] },
    { name: 'Producto I', price: '$280', image: image1, categories: [] },
    { name: 'Producto J', price: '$300', image: image1 }
  ];

  // Datos estáticos para 12 productos destacados (featured) en carrusel
  const featuredProducts = [
    { name: 'Producto Destacado A', price: '$120', image: image1 },
    { name: 'Producto Destacado B', price: '$150', image: image1 },
    { name: 'Producto Destacado C', price: '$200', image: image1 },
    { name: 'Producto Destacado D', price: '$250', image: image1 },
    { name: 'Producto Destacado E', price: '$120', image: image1 },
    { name: 'Producto Destacado F', price: '$150', image: image1 },
    { name: 'Producto Destacado G', price: '$200', image: image1 },
    { name: 'Producto Destacado H', price: '$250', image: image1 },
    { name: 'Producto Destacado I', price: '$120', image: image1 },
    { name: 'Producto Destacado J', price: '$150', image: image1 },
    { name: 'Producto Destacado K', price: '$200', image: image1 },
    { name: 'Producto Destacado L', price: '$250', image: image1 }
  ];

  // URL estática para el video de presentación (video de muestra)
  const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';  // Video de ejemplo de W3Schools

  // Datos estáticos para categorías destacadas
  const categories = [
    { name: 'Dog' },
    { name: 'Cat' },
    { name: 'Rabbit' },
    { name: 'Food' },
    { name: 'Bird' }
  ];

  // Función para dividir los productos en grupos
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <div id="root">
      <Header />
      <main>
        {/* Slider/Carrusel en la parte superior */}
        <Carousel className="mb-5">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image1}
              alt="First slide"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>First Slide</h3>
              <p>Some description for the first slide.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image1}
              alt="Second slide"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Second Slide</h3>
              <p>Some description for the second slide.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={image1}
              alt="Third slide"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Third Slide</h3>
              <p>Some description for the third slide.</p>
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
                    <Card.Img variant="top" src={product.image} alt={product.name} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>Precio: {product.price}</Card.Text>
                      <Button variant="primary">Ver Artículo</Button>
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
