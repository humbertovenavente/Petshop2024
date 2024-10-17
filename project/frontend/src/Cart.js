import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    calculateTotal(storedCart);
  }, []);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((acc, item) => {
      if (item.stock > 0 && item.quantity > 0) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);
    setTotal(totalAmount);
  };

  const handleQuantityChange = (e, itemId) => {
    const newQuantity = parseInt(e.target.value);
    const updatedItems = cartItems.map((item) => {
      if (item.id_product === itemId) {
        item.quantity = newQuantity;
      }
      return item;
    });

    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id_product !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    calculateTotal(updatedItems);
  };

  const handleProceedToCheckout = () => {
    // Redirige a la página de checkout
    navigate('/checkout');
  };

  const handleGoBack = () => {
    navigate(-1); // Navegar a la página anterior
  };

  if (!cartItems.length) {
    return (
      <div id="root">
        <Header />
        <main className="container my-5">
          <Button variant="secondary" onClick={handleGoBack} className="mb-3">
            Regresar
          </Button>
          <p>El carrito está vacío.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Calcular la cantidad total de productos que están en stock
  const totalQuantity = cartItems.reduce((acc, item) => {
    return item.stock > 0 ? acc + item.quantity : acc;
  }, 0);

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        {/* Botón para regresar a la página anterior */}
        <Button variant="secondary" onClick={handleGoBack} className="mb-3">
          Regresar
        </Button>

        <h1>Tu Carrito</h1>
        {cartItems.map((item) => (
          <div key={item.id_product} className="card mb-3">
            <div className="row no-gutters">
              <div className="col-md-4">
                {item.image ? (
                  <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Precio: ${item.price}</p>
                  <p className="card-text">{item.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                  <Form.Group controlId={`quantity-${item.id_product}`}>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      as="select"
                      value={item.stock > 0 ? item.quantity : 0}
                      onChange={(e) => handleQuantityChange(e, item.id_product)}
                      disabled={item.stock === 0}
                    >
                      {[...Array(10).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button
                    variant="danger"
                    className="mt-3"
                    onClick={() => handleRemoveItem(item.id_product)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="card p-3">
          <p><strong>Cantidad de productos:</strong> {totalQuantity}</p>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
          <Button variant="success" onClick={handleProceedToCheckout}>Proceed to checkout</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
