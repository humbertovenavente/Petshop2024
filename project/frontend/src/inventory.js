import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryAdmin() {
  const [products, setProducts] = useState([]); // Array para almacenar productos

  // Función para obtener los productos desde el backend
  // En el fetchProducts, añade una validación para manejar correctamente respuestas vacías o incorrectas
const fetchProducts = async () => {
  try {
    const response = await axios.get('http://172.16.71.178/inventory.php');
    console.log("Respuesta de la API:", response.data);
    
    // Verificar si la respuesta es un array antes de establecer los productos
    if (Array.isArray(response.data)) {
      setProducts(response.data);
    } else {
      console.error("La respuesta no es un array:", response.data);
      setProducts([]); // Establecer un array vacío si no es un array
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    setProducts([]); // Establecer un array vacío si hay error
  }
};


  useEffect(() => {
    fetchProducts(); // Llamar a la función al cargar el componente
  }, []);

  return (
    <div>
      <Header />
      <div>
        <h1>Inventario de Productos</h1>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Inventario</th>
              <th>Stock</th>
              <th>Compras</th>
              <th>Color</th> {/* Nueva columna para color */}
              <th>Tamaño</th> {/* Nueva columna para tamaño */}
              <th>Rate</th> {/* Nueva columna para rate */}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map(product => (
                <tr key={product.id_product}>
                  <td>{product.id_product}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.inventory}</td>
                  <td>{product.inventory <= 0 ? "Out of Stock" : "In Stock"}</td> {/* Condicional para Stock */}
                  <td>{product.purchase}</td>
                  <td>{product.color}</td> {/* Mostrar color */}
                  <td>{product.size}</td> {/* Mostrar tamaño */}
                  <td>{product.rate}</td> {/* Mostrar rate */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No se encontraron productos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default InventoryAdmin;

