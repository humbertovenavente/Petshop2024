import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function UserAdmin() {
  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [newUser, setNewUser] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '', // Aquí agregamos el password
    telephone: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    credit_card_name: '',
    credit_card_number: '',
    credit_card_exp: '',
    cvv: '',
    id_rol: '1', // Por defecto, se empieza con rol 1
    status: '1'  // Por defecto, se empieza como usuario activo (1)
  });

  // Función para abrir el modal
  const handleShowModal = () => setShowModal(true);
  // Función para cerrar el modal
  const handleCloseModal = () => setShowModal(false);

  // Función para obtener los usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://172.16.72.12/user.php');
      console.log("Respuesta de la API:", response.data); // Verificación de la respuesta devuelta
      if (Array.isArray(response.data)) {
        setUser(response.data);  // Guardar los usuarios en el estado
      } else {
        console.error("La respuesta no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  // Función para manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: name === 'id_rol' || name === 'status' ? parseInt(value, 10) : value // Asegúrate de que id_rol y status sean números enteros
    }));
  };

  // Función para agregar un nuevo usuario
  const handleAddUser = async () => {
    try {
      console.log("Datos que se envían:", newUser);
      const response = await axios.post('http://172.16.72.12/addProfile.php', newUser);
      console.log("Usuario agregado:", response.data);
      fetchUsers(); // Refrescar la lista de usuarios después de agregar
      handleCloseModal(); // Cerrar el modal
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsers();  // Llamar a la función al cargar el componente
  }, []);

  return (
    <div>
      <Header />
      <div>
        <h1>List of Clients</h1>

        <div className="account-profile">
          <button className="edit-profile-btn" onClick={handleShowModal}>Add New Profile</button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th> {/* Mostramos la columna de password */}
              <th>Telephone</th>
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
              <th>zipcode</th>
              <th>credit_card_name</th>
              <th>credit_card_number</th>
              <th>credit_card_exp</th>
              <th>CVV</th>
              <th>Rol</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Option</th>

            </tr>
          </thead>
          <tbody>
            {Array.isArray(user) && user.length > 0 ? (
              user.map(user => (
                <tr key={user.id_user}>
                  <td>{user.id_user}</td>
                  <td>{user.name}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td> {/* Mostrar el campo password */}
                  <td>{user.telephone}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.country}</td>
                  <td>{user.zipcode}</td>
                  <td>{user.credit_card_name}</td>
                  <td>{user.credit_card_number}</td>
                  <td>{user.credit_card_exp}</td>
                  <td>{user.cvv}</td>
                  <td>{user.id_rol }</td>
                  <td>{user.status === 1 ? 'Active' : 'Inactive'}</td>
                  <td>{user.last_login}</td>
                  <td>{user.option}</td>
                  <div className="account-profile">
          <button className="edit-profile-btn" >Edit Profile</button>
          <button className="edit-profile-btn" >Delete Profile</button>
        </div>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar nuevo usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={newUser.name} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastname" value={newUser.lastname} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" name="email" value={newUser.email} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={newUser.password} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Telephone</label>
              <input type="text" name="telephone" value={newUser.telephone} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={newUser.address} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={newUser.city} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={newUser.country} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input type="text" name="zipcode" value={newUser.zipcode} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Credit Card Name</label>
              <input type="text" name="credit_card_name" value={newUser.credit_card_name} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Credit Card Number</label>
              <input type="text" name="credit_card_number" value={newUser.credit_card_number} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Credit Card Expiration Date</label>
              <input type="text" name="credit_card_exp" value={newUser.credit_card_exp} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input type="text" name="cvv" value={newUser.cvv} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select className="form-control" name="id_rol" onChange={handleInputChange} value={newUser.id_rol}>
                <option value="1">User</option>
                <option value="2">Employee</option>
                <option value="3">Administrator</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" name="status" onChange={handleInputChange} value={newUser.status}>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default UserAdmin;

