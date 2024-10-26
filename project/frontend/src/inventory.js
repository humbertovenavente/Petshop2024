import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InventoryAdmin() {
  const [products, setProducts] = useState([]);  // Estado para almacenar productos
  const [error, setError] = useState('');  // Estado para manejar errores
  const navigate = useNavigate();  // Hook para redirigir

  // Función para obtener los productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.0.16/inventory.php');
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);  // Si no es un array, devolvemos vacío
      }
    } catch (error) {
      setProducts([]);
      setError("Error al obtener los productos");
    }
  };

  // Verificar si el usuario tiene acceso al inventario
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');  // Obtener el rol del usuario
    if (userRole !== '2' && userRole !== '3') {
      setError('No tienes acceso a esta página.');
      navigate('/');  // Redirigir al home si no es empleado ni administrador
    } else {
      fetchProducts();  // Llamar a la función solo si el usuario tiene acceso
    }
  }, [navigate]);

  // Mostrar un mensaje de error si no tiene acceso
  if (error) {
    return (
      <div>
        <Header />
        <div className="alert alert-danger">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div id="root">
      <Header />
      <main>
        <div>
          <h1>Inventario de Productos</h1>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Inventario</th>  {/* Mostramos el inventario */}
                <th>Ventas</th>  {/* Mostrar las ventas */}
                <th>Color</th>
                <th>Tamaño</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) && products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id_product}>
                    <td>{product.id_product}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.inventory}</td>  {/* Mostrar inventario */}
                    <td>{product.ventas}</td>  {/* Mostrar ventas */}
                    <td>{product.color}</td>
                    <td>{product.size}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No se encontraron productos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default InventoryAdmin;
