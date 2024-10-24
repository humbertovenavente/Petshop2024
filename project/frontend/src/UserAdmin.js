import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserAdmin() {
  const [user, setUser] = useState([]); // State to store the list of users
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode
  const [newUser, setNewUser] = useState({
    name: '',
    lastname: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    id_rol: '1', // Default role
    status: '1'  // Default status (Active)
  });
  const [searchTerm, setSearchTerm] = useState('');  // Estado para el término de búsqueda
  const [roleFilter, setRoleFilter] = useState('');  // Estado para filtrar por rol
  const [statusFilter, setStatusFilter] = useState('');  // Estado para filtrar por estado

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.0.13/user.php');
      if (Array.isArray(response.data)) {
        setUser(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form input changes for newUser
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: name === 'id_rol' || name === 'status' ? parseInt(value, 10) : value
    }));
  };

  // Open the modal for adding a new user
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
      id_rol: '1', // Default role when adding
      status: '1'  // Default status (Active) when adding
    });
    setIsEditing(false); // Set to adding mode
    setShowModal(true);  // Show the modal
  };

  // Close the modal
  const handleCloseModal = () => setShowModal(false);

  // Open the modal for editing a user
  const handleEditUser = (userToEdit) => {
    setNewUser({
      name: userToEdit.name,
      lastname: userToEdit.lastname,
      email: userToEdit.email,
      telephone: userToEdit.telephone,
      address: userToEdit.address,
      city: userToEdit.city,
      country: userToEdit.country,
      zipcode: userToEdit.zipcode,
      id_rol: String(userToEdit.id_rol),  // Ensure the role is a string
      status: String(userToEdit.status)   // Ensure the status is a string
    });
    setIsEditing(true);  // Set to editing mode
    setShowModal(true);  // Show the modal
  };

  // Add a new user
  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        alert('Please fill in all required fields');
        return;
      }

      const response = await axios.post('http://192.168.0.13/addProfile.php', newUser);
      
      if (response.data.success) {
        alert('User added successfully');
        fetchUsers();  // Refresca la lista de usuarios
        setShowModal(false);  // Cierra el modal
      } else if (response.data.error) {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Update an existing user
  const handleUpdateUser = async () => {
    try {
      const response = await axios.post('http://192.168.0.13/updateProfile2.php', newUser);  // Update endpoint
      if (response.data.success) {
        alert('User updated successfully');
        fetchUsers();  // Refresh the user list after updating
        setShowModal(false);  // Close the modal
      } else if (response.data.error) {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Save changes: either add or update a user
  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateUser();
    } else {
      handleAddUser();
    }
  };

  // Delete a user
  const handleDeleteUser = async (id_user) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        const response = await axios.post('http://192.168.0.13/deleteProfile.php', { id_user });
        if (response.data.success) {
          alert('User deleted successfully');
          fetchUsers();  // Refresh the user list after deletion
        } else {
          alert(`Error: ${response.data.error}`);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Filtrar usuarios por nombre, email, rol y estado
  const filteredUsers = user.filter(userItem => {
    const matchesRole = roleFilter ? userItem.id_rol === roleFilter : true;  // Filtrar por rol
    const matchesStatus = statusFilter ? userItem.status === statusFilter : true;  // Filtrar por estado
    const matchesSearchTerm = userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              userItem.lastname.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesStatus && matchesSearchTerm;
  });

  // Fetch users on component mount
  useEffect(() => {
    const role = localStorage.getItem('userRole'); 
    if (role !== '3' && role !== '2') {  
      navigate('/'); // Redirect if no access
    } else {
      fetchUsers();  // Fetch users when the component loads
    }
  }, [navigate]);

  return (
    <div id="root">
      <Header /> 
      <main>
        <div className="mb-3">
          <h1>Users Administration</h1>

          <h3>Filter</h3>
          <input 
            type="text" 
            placeholder="Search by name or email" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />

          <div className="mb-3">
            {/* Filtro por Rol */}
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
            {/* Filtro por Estado */}
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
                <th>Role</th> {/* Para mostrar el rol traducido */}
                <th>Status</th> {/* Para mostrar el estado traducido */}
                <th>Last Login</th>
                <th>Options</th> {/* Para las opciones de editar y eliminar */}
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
                  <td colSpan="12">No users found</td>
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
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="form-control"/>
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
            <Button variant="primary" onClick={handleSaveChanges}>
              {isEditing ? 'Save Changes' : 'Add User'}
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
      <Footer /> 
    </div>
  );
}

export default UserAdmin;
