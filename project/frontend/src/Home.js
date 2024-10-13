import React from 'react';
import { Card, Carousel, Button } from 'react-bootstrap';
import VideoComponent from './VideoC';
import Header from './header';
import Footer from './footer';

// Importa las imágenes locales
import image1 from './assets/image1.jpeg';  // Asumiendo que tu imagen se llama 'image1.png'

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

  // Función para dividir los productos en grupos de 4
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
        {/* Video de presentación */}
        <div className="video-section">
          <h2>About us video</h2>
          <VideoComponent videoUrl={videoUrl} />
        </div>
        
        {/* Productos más vendidos */}
        <div className="product-list">
          <h2>The best-selling products</h2>
          <Carousel>
            {chunkArray(topProducts, 4).map((productGroup, index) => (
              <Carousel.Item key={index}>
                <div className="d-flex justify-content-around">
                  {productGroup.map((product, idx) => (
                    <Card key={idx} className="product-card" style={{ width: '18rem' }}>
                      <Card.Img variant="top" src={product.image} alt={product.name} />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>Precio: {product.price}</Card.Text>
                        {/* Botón "Ver Artículo" debajo de cada producto */}
                        <Button variant="primary">Ver Artículo</Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Categorías destacadas */}
        <div className="category-section">
          <h2>Top categories</h2>
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
      </main>
      <Footer />
    </div>
  );
}

export default Home;







