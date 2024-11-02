import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserAdmin() {
  const [user, setUser] = useState([]); // Lista de usuarios
  const [showModal, setShowModal] = useState(false); // Control de visibilidad del modal
  const [isEditing, setIsEditing] = useState(false); // Modo de edición
  const [isLoading, setIsLoading] = useState(false); // Indicador de carga
  const [newUser, setNewUser] = useState({
    name: '',
    lastname: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    id_rol: '1', // Rol predeterminado
    status: '1'  // Estado predeterminado
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const navigate = useNavigate();

  // Obtener usuarios del backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.0.14/user.php');
      if (Array.isArray(response.data)) {
        setUser(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole'); 
    if (role !== '3' && role !== '2') {  
      navigate('/');
    } else {
      fetchUsers(); 
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
      id_rol: '1',
      status: '1'
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleEditUser = (userToEdit) => {
    setNewUser({
      id_user: userToEdit.id_user,
      name: userToEdit.name,
      lastname: userToEdit.lastname,
      email: userToEdit.email,
      telephone: userToEdit.telephone,
      address: userToEdit.address,
      city: userToEdit.city,
      country: userToEdit.country,
      zipcode: userToEdit.zipcode,
      id_rol: String(userToEdit.id_rol),
      status: String(userToEdit.status)
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await axios.post('http://192.168.0.14/addProfile.php', newUser);
      if (response.data.success) {
        alert('User added successfully');
        await fetchUsers(); // Refresca la lista de usuarios
        setShowModal(false);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.post('http://192.168.0.14/updateProfile2.php', newUser);
      if (response.data.success) {
        alert('User updated successfully');
        await fetchUsers(); // Refresca la lista de usuarios
        setShowModal(false);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true); // Mostrar el indicador de carga
    if (isEditing) {
      await handleUpdateUser();
    } else {
      await handleAddUser();
    }
    setIsLoading(false); // Ocultar el indicador de carga
    setShowModal(false); // Cerrar el modal después de la alerta
    fetchUsers(); // Refrescar la lista de usuarios para reflejar los cambios
  };
  

  const handleDeleteUser = async (id_user) => {
    if (!id_user) {
      alert("Error: User ID is missing.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        const response = await axios.post('http://192.168.0.14/deleteProfile.php', { id_user });
        console.log("Response from deleteProfile.php:", response.data);
        if (response.data.success) {
          alert(response.data.message || 'User deleted successfully');
          await fetchUsers(); // Refresca la lista de usuarios
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      }
    }
  };

  const filteredUsers = user.filter(userItem => {
    const matchesRole = roleFilter ? userItem.id_rol === roleFilter : true;
    const matchesStatus = statusFilter ? userItem.status === statusFilter : true;
    const matchesSearchTerm = userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              userItem.lastname.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesStatus && matchesSearchTerm;
  });

  return (
    <div id="root">
      <Header /> 
      <main>
        <div className="mb-3">
          <h1>Users Administration</h1>
          <input 
            type="text" 
            placeholder="Search by name or email" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />

          <div className="mb-3">
            <select 
              className="form-control" 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Filter by Role</option>
              <option value="1">User</option>
              <option value="2">Employee</option>
              <option value="3">Administrator</option>
            </select>
          </div>

          <div className="mb-3">
            <select 
              className="form-control" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
        </div>

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
                <th>Telephone</th>
                <th>Address</th>
                <th>City</th>
                <th>Country</th>
                <th>Zip Code</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(filteredUser => (
                  <tr key={filteredUser.id_user}>
                    <td>{filteredUser.id_user}</td>
                    <td>{filteredUser.name}</td>
                    <td>{filteredUser.lastname}</td>
                    <td>{filteredUser.email}</td>
                    <td>{filteredUser.telephone}</td>
                    <td>{filteredUser.address}</td>
                    <td>{filteredUser.city}</td>
                    <td>{filteredUser.country}</td>
                    <td>{filteredUser.zipcode}</td>
                    <td>{filteredUser.id_rol === '1' ? 'User' : filteredUser.id_rol === '2' ? 'Employee' : 'Administrator'}</td>
                    <td>{filteredUser.status === '1' ? 'Active' : 'Inactive'}</td>
                    <td>{filteredUser.last_login}</td>
                    <td>
                      <button onClick={() => handleEditUser(filteredUser)}>Edit Profile</button>
                      <button onClick={() => handleDeleteUser(filteredUser.id_user)}>Delete Profile</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal show={showModal} onHide={handleCloseModal}>
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
                <input type="email" name="email" value={newUser.email} onChange={handleInputChange} className="form-control" />
              </div>

              {!isEditing && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="form-control"/>
                </div>
              )}

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
                <label>Role</label>
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
            <Button variant="primary" onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Loading...
                </>
              ) : isEditing ? 'Save Changes' : 'Add User'}
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
      <Footer /> 
    </div>
  );
}

export default UserAdmin;
