import React from 'react';
import { Card } from 'react-bootstrap';

function ProductCard({ product }) {
  // Valida que las propiedades estén definidas antes de usarlas
  const { name, price, image, categories = [] } = product;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={image || 'placeholder-image-url'} alt={name} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>Precio: {price}</Card.Text>
        {/* Solo intenta usar .join() si categories es un array */}
        <Card.Text>Categorías: {categories.length > 0 ? categories.join(', ') : 'Sin categorías'}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
