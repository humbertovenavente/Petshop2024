import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Carousel } from 'react-bootstrap';
import VideoComponent from './VideoC';
import ProductCard from './ProductCard'; 
import CarouselComponent from './CarouselC';
import Header from './header';
import Footer from './footer';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);  // Productos destacados
  const [topProducts, setTopProducts] = useState([]);  // Listado de 10 productos
  const [categories, setCategories] = useState([]);  // Categorías destacadas
  const [videoUrl, setVideoUrl] = useState('');  // URL del video de presentación

  useEffect(() => {
    fetchFeaturedProducts();
    fetchTopProducts();
    fetchCategories();
    fetchVideo();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('http://172.16.71.178/featuredProducts.php');
      setFeaturedProducts(response.data.slice(0, 4));  // Limitar a 4 productos
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await axios.get('http://172.16.71.178/topProducts.php');
      setTopProducts(response.data.slice(0, 10));  // Limitar a 10 productos
    } catch (error) {
      console.error('Error fetching top products:', error);
      // Generar 10 cards vacías como placeholder
      setTopProducts(Array(10).fill({ name: 'Producto vacío', price: '-', categories: [''], image: '' }));
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://172.16.71.178/categories.php');
      setCategories(response.data.slice(0, 5));  // Limitar a 5 categorías
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Generar 5 cards vacías como placeholder
      setCategories(Array(5).fill({ name: 'Categoría vacía' }));
    }
  };

  const fetchVideo = async () => {
    try {
      const response = await axios.get('http://172.16.71.178/video.php');
      setVideoUrl(response.data.url);  // Video URL
    } catch (error) {
      console.error('Error fetching video URL:', error);
      // Colocar un video de placeholder
      setVideoUrl('');  // Puedes poner un enlace a un video predeterminado si lo tienes
    }
  };

  // Divide los productos en grupos de 4 para que se muestren en el carrusel
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
            {/* Carrusel de productos destacados */}
            <CarouselComponent products={featuredProducts} />
      
            {/* Video de presentación */}
            <div className="video-section">
              <h2>Video de Presentación</h2>
              <VideoComponent videoUrl={videoUrl} />
            </div>
      
            {/* Productos más vendidos */}
            <div className="product-list">
              <h2>Productos Más Vendidos</h2>
              <Carousel>
                {chunkArray(topProducts, 4).map((productGroup, index) => (
                  <Carousel.Item key={index}>
                    <div className="d-flex justify-content-around">
                      {productGroup.map((product, idx) => (
                        <ProductCard key={idx} product={product} />
                      ))}
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
      
            {/* Categorías destacadas */}
            <div className="category-section">
              <h2>Categorías Destacadas</h2>
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

