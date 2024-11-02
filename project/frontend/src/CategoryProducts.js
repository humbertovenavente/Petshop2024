import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para obtener los parámetros de la URL y navegación
import { Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

// Importa los estilos CSS personalizados

function CategoryProducts() {
  const { categoryId, categoryName } = useParams(); // Obtener el id y nombre de la categoría desde la URL
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook para navegación

  // Función para obtener los productos de la categoría seleccionada
  const fetchProductsByCategory = useCallback(async () => {
    try {
      const response = await axios.get(`http://192.168.0.14/CategoryProduct.php?categoryId=${categoryId}`);
      
      // Asegurarse de que la respuesta sea un array antes de llamarlo en setProducts
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]); // Si no es un array, se asigna un array vacío
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // En caso de error, manejarlo con un array vacío
    }
  }, [categoryId]);
  
  useEffect(() => {
    fetchProductsByCategory();
  }, [fetchProductsByCategory]); // Ahora está como dependencia correcta

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        {/* Botón "Back" para regresar a la página de categorías */}
        <Button variant="secondary" onClick={() => navigate('/Category')} >
          Back to Categories
        </Button>

        <h1>{categoryName}</h1> {/* Título con el nombre de la categoría */}
        
        <Row className="products-grid">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id_product} md={4} className="mb-4 product-card">
                <Card className="product-card">  {/* Asegúrate de usar la clase product-card */}
  <Card.Img 
    variant="top" 
    src={product.image} 
    className="product-image" 
  />
  <Card.Body>
    <Card.Title>{product.name}</Card.Title>
    <Card.Text>Precio: ${product.price}</Card.Text>
    <Button
      variant="primary"
      onClick={() => navigate(`/ProductDetails/${product.id_product}`)}
    >
      View article
    </Button>
  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No products found in this category</p>
          )}
        </Row>
      </main>
      <Footer />
    </div>
  );
}

export default CategoryProducts;
