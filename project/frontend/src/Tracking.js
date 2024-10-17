import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import { Button } from 'react-bootstrap';

function Tracking() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.post('http://192.168.0.131/getOrders2.php', { id_order: orderId });
        if (response.data.success) {
          setOrderDetails(response.data.orderDetails);
        } else {
          console.error('Error fetching order details:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <h1>Tracking of your order: {orderId}</h1>

        {/* Mostrar el estado de la orden */}
        <p>The status of your order is: <strong>{orderDetails.status}</strong></p>
        
        {/* Comentario como nota (no editable) */}
        <div>
          <label>Comments about this order:</label>
          <p>{orderDetails.comment || 'No comments available'}</p> {/* Mostrar el comentario de la base de datos */}
        </div>

        <h2>Information about the order</h2>
        {orderDetails.products.length > 0 ? (
          <div>
            {orderDetails.products.map((product, index) => (
              <div key={index} className="card mb-3">
                <div className="row no-gutters">
                  <div className="col-md-4">
                    {product.image ? (
                      <img
                        src={`data:image/jpeg;base64,${product.image}`}
                        alt={product.name}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">Price: ${product.price}</p>
                      <p className="card-text">Quantity: {product.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <p><strong>Cantidad de productos:</strong> {orderDetails.total_items}</p>
            <p><strong>Precio total:</strong> ${orderDetails.total_price.toFixed(2)}</p>
          </div>
        ) : (
          <p>No items in this order.</p>
        )}

        <Button variant="secondary" onClick={() => navigate('/MyOrders')}>
          Go back
        </Button>
      </main>
      <Footer />
    </div>
  );
}

export default Tracking;
