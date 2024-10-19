import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import axios from 'axios';  
import './App.css';


function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();  

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const response = await axios.get('http://192.168.0.131/topSells.php');
        setTopProducts(response.data);
      } catch (error) {
        console.error('Error al obtener los productos más vendidos', error);
      }
    }
    fetchTopProducts();
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/ProductDetails/${productId}`);  
  };

  return (
    <div id="root">
      <Header />
      <main>
        {/* Productos más vendidos en 2 filas de 5 productos */}
        <div className="product-list">
          <h2>The Best-Selling Products</h2>
          <div className="row">
            {topProducts.map((product, idx) => (
              <Card key={idx}  style={{ width: '18rem' }}>
                <Card.Img 
  variant="top" 
  src={`data:image/jpeg;base64,${product.image}`} 
  alt={product.name} 
  style={{ objectFit: 'cover', height: '300px', width: '100%' }}  // Estilos en línea
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
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
