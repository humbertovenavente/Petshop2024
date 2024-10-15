import React from 'react';
import Header from './header';
import Footer from './footer';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useCategory } from './CategoryContext'; // Importar el hook del contexto

function Category() {
  const { categories } = useCategory(); // Obtener el estado de categorías del contexto

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <h1>Categories</h1>

        {/* Listado de categorías */}
        <h2>Categories</h2>
        <Row>
          {categories.map(category => (
            <Col key={category.id_category} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Button variant="primary">View Category</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </main>
      <Footer />
    </div>
  );
}

export default Category;
