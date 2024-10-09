import React from 'react';
import { Card, Button } from 'react-bootstrap';

function ProductCard({ product }) {
  return (
    <Card className="product-card">
      <Card.Img variant="top" src={`data:image/jpeg;base64,${product.image}`} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>Precio: {product.price}</Card.Text>
        <Card.Text>Categorías: {product.categories.join(', ')}</Card.Text>
        <Button variant="primary">Ver Artículo</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
