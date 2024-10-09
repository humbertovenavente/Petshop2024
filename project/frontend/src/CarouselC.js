import React from 'react';
import { Carousel } from 'react-bootstrap';

function CarouselComponent({ products }) {
  return (
    <Carousel>
      {products.map((product, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={`data:image/jpeg;base64,${product.image}`}  // Imagen del producto (blob)
            alt={product.name}
          />
          <Carousel.Caption>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default CarouselComponent;
