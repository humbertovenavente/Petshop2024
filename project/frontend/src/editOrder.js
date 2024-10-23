import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

function EditOrder() {
  const { id_order } = useParams(); // Obtener el ID de la orden desde los parámetros de la URL
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]); // Estado para almacenar productos de la orden
  const [error, setError] = useState(''); // Para manejar errores
  const [comment, setComment] = useState(''); // Para manejar el comentario del estado
  const [lastComment, setLastComment] = useState(''); // Para mostrar el último comentario del estado anterior
  const [statusIndex, setStatusIndex] = useState(0); // Índice de estado actual
  const [loading, setLoading] = useState(false); // Estado para manejar el loading
  const [confirmation, setConfirmation] = useState(''); // Confirmación de actualización

  // Memorizar el array de estados
  const statusSteps = useMemo(() => ['Accepted', 'Preparing', 'Route', 'Delivered'], []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://172.16.71.159/editOrder.php?id_order=${id_order}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.order); // Almacenar los detalles de la orden en el estado
          setProducts(data.products); // Guardar los productos de la orden
          setStatusIndex(statusSteps.indexOf(data.order.status)); // Definir el índice del estado
          setLastComment(data.order.comment); // Cargar el último comentario
        } else {
          console.error('Error fetching order details:', data.message);
          setError('Error al obtener los detalles del pedido.');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Error al obtener los detalles del pedido.');
      }
    };

    fetchOrderDetails(); // Llamar a la función para obtener los detalles del pedido
  }, [id_order, statusSteps]);

  // Función para avanzar al siguiente estado y guardar el estado y comentario
  const handleNextStatus = async () => {
    if (statusIndex < statusSteps.length - 1) {
      const newStatus = statusSteps[statusIndex + 1];
      
      // Mostrar el estado de loading
      setLoading(true);
      setConfirmation(''); // Limpiar confirmación previa

      // Enviar el nuevo estado y comentario al servidor
      try {
        const response = await fetch(`http://172.16.71.159/updateOrderStatus.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_order, status: newStatus, comment }) // Asegúrate de enviar el comentario
        });
        
        const data = await response.json();
        if (data.success) {
          setLastComment(comment); // Guardar el comentario actual como el último comentario
          setStatusIndex(statusIndex + 1); // Actualizar al siguiente estado
          setComment(''); // Limpiar el comentario después de guardar
          setConfirmation('El estado ha sido actualizado exitosamente.'); // Mostrar confirmación
        } else {
          setError('Error al actualizar el estado del pedido.');
        }
      } catch (error) {
        console.error('Error al conectarse con el servidor:', error);
        setError('Error al conectarse con el servidor.');
      } finally {
        setLoading(false); // Quitar el loading
      }
    }
  };

  // Función para actualizar el comentario en el estado "Delivered"
  const handleUpdateComment = async () => {
    // Mostrar el estado de loading
    setLoading(true);
    setConfirmation(''); // Limpiar confirmación previa

    // Enviar el comentario actualizado al servidor
    try {
      const response = await fetch(`http://172.16.71.159/updateOrderStatus.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_order, status: 'Delivered', comment }) // Solo actualiza el comentario en "Delivered"
      });
      
      const data = await response.json();
      if (data.success) {
        setLastComment(comment); // Guardar el comentario actual como el último comentario
        setConfirmation('El comentario ha sido actualizado exitosamente.'); // Mostrar confirmación
      } else {
        setError('Error al actualizar el comentario.');
      }
    } catch (error) {
      console.error('Error al conectarse con el servidor:', error);
      setError('Error al conectarse con el servidor.');
    } finally {
      setLoading(false); // Quitar el loading
    }
  };

  return (
    <div id="root">
      <Header />
      <main>
        <div className="container my-5">
          <h1>Edit Order: {id_order}</h1>
          {error && <p className="text-danger">{error}</p>} {/* Mostrar mensaje de error */}
          {confirmation && <p className="text-success">{confirmation}</p>} {/* Mostrar confirmación */}
          {loading && <p>Actualizando el estado...</p>} {/* Mostrar loading */}
          {order ? (
            <>
              <div className="card">
                <div className="card-body">
                  <p>Email address: {order.email}</p>
                  <p>Name: {order.name} {order.lastname}</p>
                  <p>Current status: {statusSteps[statusIndex]}</p>

                  {/* Mostrar estados como botones */}
                  <div className="status-buttons">
                    {statusSteps.map((status, index) => (
                      <button 
                        key={index}
                        className={`btn ${index === statusIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                        disabled={index !== statusIndex} // Solo habilitar el botón del estado actual
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {statusIndex < statusSteps.length - 1 && (
                    <button 
                      className="btn btn-secondary mt-3"
                      onClick={handleNextStatus}
                      disabled={loading}
                    >
                      Next
                    </button>
                  )}

                  {/* Mostrar último comentario solo si hay un comentario */}
                  {lastComment && (
                    <p className="mt-3">
                      <strong>Último comentario: </strong>{lastComment}
                    </p>
                  )}

                  {/* Área para añadir comentario */}
                  <div className="comment-section mt-4">
                    <textarea
                      placeholder="Add comment to this status"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  {/* Mostrar botón de "Guardar comentario" solo en el estado "Delivered" */}
                  {statusSteps[statusIndex] === 'Delivered' && (
                    <button 
                      className="btn btn-primary mt-2"
                      onClick={handleUpdateComment}
                      disabled={loading}
                    >
                      Guardar comentario
                    </button>
                  )}
                </div>
              </div>

              {/* Sección para mostrar la información del producto */}
              <h3 className="mt-5">Information about the order</h3>
              <ul>
                {products.map((product, index) => (
                  <li key={index} className="card mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }}
                    />
                    <div>
                      <p><strong>{product.name}</strong></p>
                      <p>Price: ${product.price}</p>
                      <p>Quantity: {product.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p><strong>Total Price: </strong> ${products.reduce((total, product) => total + (product.price * product.quantity), 0)}</p>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EditOrder;
