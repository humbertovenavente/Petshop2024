import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function ManageOrder() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // Estado para órdenes filtradas
  const [filterStatus, setFilterStatus] = useState(''); // Estado para el filtro
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const role = localStorage.getItem('userRole'); 

    if (role !== '3' && role !== '2') {  
      setError(' Access denied');
      navigate('/'); 
    } else {
      fetchOrders(); 
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://192.168.0.14/getAllOrders.php'); 
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders); // Inicializar órdenes filtradas con todas las órdenes
      } else {
        console.error('Error fetching orders:', data.message);
        setError('Error al obtener órdenes.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error al obtener órdenes.');
    }
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);

    const filtered = orders.filter(order =>
      order.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  return (
    <div id="root">
      <Header />
        <main>
          <div className="container my-5">
            <h1>Manage Orders</h1>
            {error && <p className="text-danger">{error}</p>}

            {/* Campo de entrada para el filtro por estado */}
            <div className="mb-3">
              <label htmlFor="filterStatus" className="form-label">Filter by status</label>
              <input
                type="text"
                id="filterStatus"
                className="form-control"
                placeholder="Write the status"
                value={filterStatus}
                onChange={handleFilterChange}
              />
            </div>

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id_order} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">Order number: {order.id_order}</h5>
                    <p className="card-text">Status: {order.status}</p>
                    <p className="card-text">User Name: {order.name}</p>
                    <p className="card-text">User Email: {order.email}</p>
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
