import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function InventoryAdmin() {
  const [products, setProducts] = useState([]); // Array para almacenar productos
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [currentProductId, setCurrentProductId] = useState(null); // ID del producto que se está editando
  const [newInventory, setNewInventory] = useState(0); // Nuevo valor del inventario

  // Función para obtener los productos desde el backend
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
    }
  };

  // Abrir el modal para editar el inventario de un producto
  const handleEditInventory = (product) => {
    setCurrentProductId(product.id_product);
    setNewInventory(product.inventory); // Establecer el inventario actual
    setShowModal(true);
  };

  // Guardar los cambios del inventario
  const handleSaveChanges = async () => {
    try {
      const response = await axios.post('http://172.16.71.178/updateInventory.php', {
        id_product: currentProductId,
        inventory: newInventory
      });
      console.log("Inventario actualizado:", response.data);
      fetchProducts(); // Refrescar la lista de productos
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar el inventario:", error);
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
              <th>Opciones</th> {/* Nueva columna para las opciones */}
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
                  <td>
                    <button className="edit-profile-btn" onClick={() => handleEditInventory(product)}>Editar Inventario</button>
                  </td>
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

      {/* Modal para editar el inventario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Nuevo Inventario</label>
              <input 
                type="number" 
                value={newInventory} 
                onChange={(e) => setNewInventory(e.target.value)} 
                className="form-control"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default InventoryAdmin;
