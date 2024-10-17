import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    country: '',
    zip: ''
  });
  const [creditCard, setCreditCard] = useState({
    name: '',
    cardNumber: '',
    expiration: '',
    cvv: ''
  });

  const navigate = useNavigate();

  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);
  const [showCreditConfirmation, setShowCreditConfirmation] = useState(false);

  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.post('http://172.16.72.69/profile.php', {
          email,
          password,
        });
        const profile = response.data;

        if (profile) {
          setShippingAddress({
            address: profile.address || '',
            city: profile.city || '',
            country: profile.country || '',
            zip: profile.zipcode || '',
          });
          setCreditCard({
            name: profile.credit_card_name || '',
            cardNumber: profile.credit_card_number || '',
            expiration: profile.credit_card_exp || '',
            cvv: profile.cvv || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const inStockItems = storedCart.filter(item => item.stock > 0);
    setCartItems(inStockItems);

    const totalAmount = inStockItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);

    setShipping(totalAmount >= 500 ? 0 : 35);
  }, [email, password]);

  const handlePlaceOrder = () => {
    alert("Orden realizada correctamente");
  };

  const handleEditShipping = () => {
    setShowAddressConfirmation(true); // Mostrar modal de confirmación
  };

  const handleEditCreditCard = () => {
    setShowCreditConfirmation(true); // Mostrar modal de confirmación
  };

  const handleGoBack = () => {
    navigate(-1);  // Regresar a la página anterior
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id_product !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    setTotal(updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
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
    setTotal(updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  };

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <h1>Checkout</h1>

        {/* Sección de Dirección de Envío */}
        <h2>Shipping Address</h2>
        <p>Address: {shippingAddress.address || 'No disponible'}</p>
        <p>City: {shippingAddress.city || 'No disponible'}</p>
        <p>Country: {shippingAddress.country || 'No disponible'}</p>
        <p>Zip Code: {shippingAddress.zip || 'No disponible'}</p>
        <Button onClick={handleEditShipping}>Edit Shipping Address</Button>

        {/* Sección de Información de Tarjeta */}
        <h2>Credit Card Information</h2>
        <p>Name on Card: {creditCard.name || 'No disponible'}</p>
        <p>Card Number: {creditCard.cardNumber || 'No disponible'}</p>
        <p>Expiration Date: {creditCard.expiration || 'No disponible'}</p>
        <p>CVV: {creditCard.cvv || 'No disponible'}</p>
        <Button onClick={handleEditCreditCard}>Edit Credit Card</Button>

        {/* Sección de Productos */}
        <h2>Review Item and Shipping</h2>
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
                  <Form.Group controlId={`quantity-${item.id_product}`}>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      as="select"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(e, item.id_product)}
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

        <p>Shipping: {total >= 500 ? 'Free Shipping' : `$${shipping}`}</p>

        <div className="card p-3">
          <p><strong>Cantidad de productos:</strong> {cartItems.length}</p>
          <p><strong>Total:</strong> ${(total + shipping).toFixed(2)}</p>
          <Button variant="success" onClick={handlePlaceOrder}>Place your order</Button>
        </div>

        <Button variant="secondary" onClick={handleGoBack} className="mt-3">
          Back to Cart
        </Button>

        {/* Modal de confirmación para la dirección */}
        <Modal show={showAddressConfirmation} onHide={() => setShowAddressConfirmation(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Shipping Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Los cambios en la dirección de envío se hacen en tu cuenta. ¿Deseas continuar para editar tu perfil?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddressConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => navigate('/Account')}>
              Yes, go to Account
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de confirmación para la tarjeta de crédito */}
        <Modal show={showCreditConfirmation} onHide={() => setShowCreditConfirmation(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Credit Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Los cambios en la información de la tarjeta de crédito se hacen en tu cuenta. ¿Deseas continuar para editar tu perfil?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreditConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => navigate('/Account')}>
              Yes, go to Account
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;
