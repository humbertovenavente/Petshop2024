import React from 'react';
import Header from './header';
import Footer from './footer';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';

function Category() {
  // Datos quemados para categorías y productos
  const products = [
    { id: 1, name: 'Product A', price: 100, inStock: true },
    { id: 2, name: 'Product B', price: 200, inStock: false },
    { id: 3, name: 'Product C', price: 300, inStock: true },
  ];

  const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' }
  ];

  const priceRanges = ['Under $100', '$100 - $200', '$200 - $300', 'Above $300'];

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <h1>Find your products</h1>

        {/* Filtros de búsqueda */}
        <Form className="mb-4">
          <Row>
            {/* Filtro por precio */}
            <Col md={4}>
              <Form.Group controlId="priceFilter">
                <Form.Label>Price Range</Form.Label>
                <Form.Control as="select">
                  <option value="">All Prices</option>
                  {priceRanges.map((range, index) => (
                    <option key={index} value={range}>{range}</option>
                  ))}
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

            {/* Filtro por disponibilidad de stock */}
            <Col md={4} className="d-flex align-items-end">
              <Form.Group controlId="stockFilter">
                <Form.Check type="checkbox" label="In Stock Only" />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* Listado de productos en forma de cards */}
        <h2>Filtered Products</h2>
        <Row>
          {products.map(product => (
            <Col key={product.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: ${product.price}</Card.Text>
                  <Card.Text>{product.inStock ? 'In Stock' : 'Out of Stock'}</Card.Text>
                  <Button variant="primary">View Product</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <h2>Categories</h2>
      </main>
      <Footer />
    </div>
  );
}

export default Category;






