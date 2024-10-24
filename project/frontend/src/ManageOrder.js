import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function ManageOrder() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(''); // Agregar estado para manejar errores
  const navigate = useNavigate(); 

  useEffect(() => {
    const role = localStorage.getItem('userRole'); 

    if (role !== '3' && role !== '2') {  
      setError('No tienes acceso a esta página.'); // Establecer mensaje de error
      navigate('/'); 
    } else {
      fetchOrders(); 
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://192.168.0.13/getAllOrders.php'); 
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders); 
      } else {
        console.error('Error fetching orders:', data.message);
        setError('Error al obtener órdenes.'); // Establecer mensaje de error
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error al obtener órdenes.'); // Establecer mensaje de error
    }
  };

  return (
    <div id="root">
      <Header />
        <main>
          <div className="container my-5">
            <h1>Manage Orders</h1>
            {error && <p className="text-danger">{error}</p>} {/* Mostrar mensaje de error si existe */}
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id_order} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Order number: {order.id_order}</h5>
                    <p className="card-text">Status: {order.status}</p>
                    <p className="card-text">User Name: {order.name}</p> {/* Mostrar el nombre del usuario */}
                    <p className="card-text">User Email: {order.email}</p> {/* Mostrar el correo del usuario */}
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/editOrder/${order.id_order}`)}
                    >
                      Edit order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </main>
      <Footer />
    </div>
  );
}

export default ManageOrder;
