import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import Footer from './footer';
import { Button } from 'react-bootstrap';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post('http://192.168.0.131/getOrders.php', { email });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [email]);

  const handleViewOrder = (orderId) => {
    navigate(`/orderDetails/${orderId}`);
  };

  return (
    <div id="root">
      <Header />
      <main className="container my-5">
        <h1>Your Orders</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id_order} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Order number: {order.id_order}</h5>
                <p className="card-text">Order issued on: {new Date(order.order_date).toLocaleDateString()}</p>
                <p className="card-text">Status: {order.status}</p>
                <p className="card-text">Total spent: ${order.total_price}</p>
                <p className="card-text">Total items: {order.total_items}</p>
                <Button variant="primary" onClick={() => handleViewOrder(order.id_order)}>
                  View order
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default MyOrders;
