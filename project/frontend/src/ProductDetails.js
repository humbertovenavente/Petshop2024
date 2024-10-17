import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import Header from './header';
import Footer from './footer';

function ProductDetails({ userRole }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await axios.get(`http://172.16.72.69/ProductDetails.php?productId=${productId}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    fetchProductDetails();
  }, [productId]);

  // Función para agregar el producto al carrito
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newProduct = { ...product, quantity };
    const updatedCart = [...cart, newProduct];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`Agregaste ${quantity} artículo(s) al carrito`);
  };

  const handleQuantityChange = (e) => {
    const selectedQuantity = parseInt(e.target.value);
    if (selectedQuantity > product.inventory) {
      setError(`Insuficientes artículos, solo quedan ${product.inventory}.`);
    } else {
      setError('');
      setQuantity(selectedQuantity);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!product) {
    return <p>Cargando detalles del producto...</p>;
  }

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <Button variant="secondary" onClick={handleGoBack} className="mb-3">
          Regresar
        </Button>

        <h1>{product.name}</h1>

        {product.image ? (
          <img
            src={`data:image/jpeg;base64,${product.image}`}
            alt={product.name}
            style={{ width: '300px', height: '300px', objectFit: 'cover' }}
          />
        ) : (
          <p>No image available</p>
        )}
        <p><strong>Name:</strong> {product.name || 'No disponible'}</p>
        <p><strong>Descripción:</strong> {product.description || 'No disponible'}</p>
        <p><strong>Precio:</strong> ${product.price || 'No disponible'}</p>
        <p><strong>Color:</strong> {product.color || 'No aplica'}</p>
        <p><strong>Tamaño:</strong> {product.size || 'No aplica'}</p>

        <Form.Group>
          <Form.Label>Cantidad</Form.Label>
          <Form.Control as="select" value={quantity} onChange={handleQuantityChange} disabled={product.stock === 0}>
            {[...Array(10).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </Form.Control>
        </Form.Group>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button
          variant="primary"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || quantity > product.inventory}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Agregar Artículo'}
        </Button>
      </main>
      <Footer />
    </div>
  );
}

export default ProductDetails;
