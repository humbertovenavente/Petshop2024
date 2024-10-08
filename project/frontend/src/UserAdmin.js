import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function UserAdmin() {

  const [user, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false); // Control del modal
  const [isEditing, setIsEditing] = useState(false); // Si estamos editando o agregando
  const [newUser, setNewUser] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    telephone: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    credit_card_name: '',
    credit_card_number: '',
    credit_card_exp: '',
    cvv: '',
    id_rol: '1', // Rol por defecto
    status: '1'  // Status por defecto (Activo)
  });

  // Función para obtener los usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://172.16.71.178/user.php');
      console.log("Respuesta de la API:", response.data);
      if (Array.isArray(response.data)) {
        setUser(response.data);
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
      [name]: name === 'id_rol' || name === 'status' ? parseInt(value, 10) : value
    }));
  };


  // Función para abrir el modal para agregar
  const handleShowModal = () => {
    setNewUser({
      name: '',
      lastname: '',
      email: '',
      password: '',
      telephone: '',
      address: '',
      city: '',
      country: '',
      zipcode: '',
      credit_card_name: '',
      credit_card_number: '',
      credit_card_exp: '',
      cvv: '',
      id_rol: '1',
      status: '1'
    });
    setIsEditing(false); // No estamos editando, estamos agregando
    setShowModal(true);
  };

 // Función para cerrar el modal
 const handleCloseModal = () => setShowModal(false);
  // Función para abrir el modal para editar
  const handleEditUser = (user) => {
    setNewUser(user); // Cargar los datos del usuario seleccionado
    setIsEditing(true); // Estamos en modo edición
    setShowModal(true); // Mostrar el modal
  };

  // Función para agregar un nuevo usuario
  const handleAddUser = async () => {
    try {
      console.log("Datos que se envían:", newUser);
      const response = await axios.post('http://172.16.71.178/addProfile.php', newUser);
      console.log("Usuario agregado:", response.data);
      fetchUsers(); // Refrescar la lista de usuarios después de agregar
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  // Función para actualizar un usuario
  const handleUpdateUser = async () => {
    try {
      console.log("Datos que se envían para actualizar:", newUser);
      const response = await axios.post('http://172.16.71.178/updateProfile2.php', newUser); // Asegúrate de tener un endpoint de actualización
      console.log("Usuario actualizado:", response.data);
      fetchUsers(); // Refrescar la lista de usuarios después de actualizar
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  // Función que decide si agregar o actualizar en el modal
  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateUser();
    } else {
      handleAddUser();
    }
  };

  // Función para eliminar un usuario
const handleDeleteUser = async (id_user) => {
  if (window.confirm("Are you sure you want to delete this profile?")) { // Confirmación antes de eliminar
    try {
      const response = await axios.post('http://172.16.71.178/deleteProfile.php', { id_user });
      console.log("Usuario eliminado:", response.data);
      fetchUsers(); // Refrescar la lista de usuarios después de eliminar
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }
};


  useEffect(() => {
    fetchUsers(); // Llamar a la función al cargar el componente
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
              <th>Password</th>
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
              <th>Options</th>
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
                  <td>{user.password}</td>
                  <td>{user.telephone}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.country}</td>
                  <td>{user.zipcode}</td>
                  <td>{user.credit_card_name}</td>
                  <td>{user.credit_card_number}</td>
                  <td>{user.credit_card_exp}</td>
                  <td>{user.cvv}</td>
                  <td>{user.id_rol}</td>
                  <td>{user.status === 1 ? 'Active' : 'Inactive'}</td>
                  <td>{user.last_login}</td>
                  <td>
                    <button className="edit-profile-btn" onClick={() => handleEditUser(user)}>Edit Profile</button>
                    <button className="delete-profile-btn" onClick={() => handleDeleteUser(user.id_user)}>Delete Profile</button>
                  </td>
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

      {/* Modal para agregar o editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit User' : 'Add New User'}</Modal.Title>
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
          <Button variant="primary" onClick={handleSaveChanges}>
            {isEditing ? 'Save Changes' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default UserAdmin;
