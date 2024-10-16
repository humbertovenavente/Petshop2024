import React from 'react';
import Header from './header';
import Footer from './footer';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useCategory } from './CategoryContext';
import { Link } from 'react-router-dom'; // Importar Link para redirigir

function Category() {
  const { categories } = useCategory();

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <h1>Categories</h1>
        <h2>Categories</h2>
        <Row>
          {categories.length > 0 ? (
            categories.map(category => (
              <Col key={category.id_category} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{category.name}</Card.Title>
                    {/* Redirigir al listado de productos de la categoría */}
                    <Link to={`/category/${category.id_category}/${category.name}`}>
                      <Button variant="primary">View Category</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </Row>
      </main>
      <Footer />
    </div>
  );
}

export default Category;
