import React, { useState } from 'react';
import Header from './header';
import Footer from './footer';
import { Form, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import image1 from './assets/image1.jpeg';

function Category() {
  // Estado para el deslizador de precios
  const [price, setPrice] = useState(300);  // Rango inicial del precio
  const [rate, setRate] = useState(0);

  // Datos quemados de categorías
  const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
    { id: 4, name: 'Category 4' },
    { id: 5, name: 'Category 5' },
  ];

  // Productos simulados con tags
  const productsWithTags = [
    { id: 1, name: 'Product A', tags: 5, price: 100, rate: 4.5, inStock: true },
    { id: 2, name: 'Product B', tags: 3, price: 200, rate: 4.0, inStock: false },
    { id: 3, name: 'Product C', tags: 8, price: 300, rate: 4.7, inStock: true },
    { id: 4, name: 'Product D', tags: 7, price: 150, rate: 3.5, inStock: true },
    { id: 5, name: 'Product E', tags: 6, price: 250, rate: 4.3, inStock: true },
    { id: 6, name: 'Product F', tags: 4, price: 180, rate: 4.1, inStock: true },
    { id: 7, name: 'Product G', tags: 9, price: 220, rate: 5.0, inStock: false },
    { id: 8, name: 'Product H', tags: 10, price: 120, rate: 3.8, inStock: true },
    { id: 9, name: 'Product I', tags: 6, price: 90, rate: 4.4, inStock: false },
    { id: 10, name: 'Product J', tags: 8, price: 270, rate: 4.6, inStock: true },
    { id: 11, name: 'Product K', tags: 2, price: 150, rate: 4.5, inStock: true },
    { id: 12, name: 'Product L', tags: 7, price: 130, rate: 3.9, inStock: false },
    { id: 13, name: 'Product M', tags: 5, price: 160, rate: 4.2, inStock: true },
    { id: 14, name: 'Product N', tags: 4, price: 300, rate: 4.0, inStock: true },
    { id: 15, name: 'Product O', tags: 9, price: 350, rate: 4.9, inStock: true },
    { id: 16, name: 'Product P', tags: 3, price: 110, rate: 3.5, inStock: true },
    { id: 17, name: 'Product Q', tags: 6, price: 200, rate: 4.1, inStock: true },
    { id: 18, name: 'Product R', tags: 8, price: 190, rate: 4.3, inStock: false },
    { id: 19, name: 'Product S', tags: 7, price: 140, rate: 4.6, inStock: true },
    { id: 20, name: 'Product T', tags: 10, price: 230, rate: 4.8, inStock: true },
  ];

  // Función para dividir los productos en grupos de 4 para el carrusel
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
      <main className="container my-5">
        <h1>Categories</h1>

        {/* Listado de categorías */}
        <h2>Categories</h2>
        <Row>
          {categories.map(category => (
            <Col key={category.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Button variant="primary">View Category</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

             {/* Filtro por rango de precios */}
             <Row className="my-4">
            <Col md={12}>
              <Form.Group controlId="priceFilter">
                <Form.Label>Price Range</Form.Label>
                <RangeSlider
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  max={500}
                  tooltip="on"
                />
                <p>Selected Price: ${price}</p>
              </Form.Group>
            </Col>
          </Row>


        {/* Carrusel de productos con más tags */}
        <h2>Top 20 Products with Most Tags</h2>
        <Carousel>
          {chunkArray(productsWithTags, 4).map((productGroup, index) => (
            <Carousel.Item key={index}>
              <div className="d-flex justify-content-around">
                {productGroup.map((product, idx) => (
                  <Card key={idx} className="product-card" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={image1} alt={product.name} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>Price: ${product.price}</Card.Text>
                      <Card.Text>Tags: {product.tags}</Card.Text>
                      <Button variant="primary">See Item</Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
    
        {/* Filtros de búsqueda */}
        <h2>Search Filters</h2>
        <Form className="mb-4">
          <Row>
            {/* Filtro por calificación (rate) */}
            <Col md={4}>
              <Form.Group controlId="rateFilter">
                <Form.Label>Rating</Form.Label>
                <Form.Control as="select" value={rate} onChange={(e) => setRate(e.target.value)}>
                  <option value={0}>All Ratings</option>
                  <option value={1}>1 Star & Above</option>
                  <option value={2}>2 Stars & Above</option>
                  <option value={3}>3 Stars & Above</option>
                  <option value={4}>4 Stars & Above</option>
                  <option value={5}>5 Stars Only</option>
                </Form.Control>
              </Form.Group>
            </Col>

            {/* Filtro por categoría */}
            <Col md={4}>
              <Form.Group controlId="categoryFilter">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select">
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            {/* Filtro por disponibilidad */}
            <Col md={4} className="d-flex align-items-end">
              <Form.Group controlId="stockFilter">
                <Form.Check type="checkbox" label="In Stock Only" />
              </Form.Group>
            </Col>
          </Row>

         
        </Form>
      </main>
      <Footer />
    </div>
  );
}

export default Category;
