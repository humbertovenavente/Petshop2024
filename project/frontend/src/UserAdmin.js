import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function UserAdmin() {

  // State to store the list of users
  const [user, setUser] = useState([]);
  // State to control whether the modal is visible or not
  const [showModal, setShowModal] = useState(false); 
  // State to control whether we are in edit mode (true) or adding mode (false)
  const [isEditing, setIsEditing] = useState(false); 
  // State to store the new user details or the user being edited
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
    id_rol: '1', // Default role
    status: '1'  // Default status (Active)
  });

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.0.131/user.php');
      console.log("API Response:", response.data);
      // Check if the response data is an array before setting the state
      if (Array.isArray(response.data)) {
        setUser(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle changes in the form inputs for newUser
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: name === 'id_rol' || name === 'status' ? parseInt(value, 10) : value
    }));
  };

  // Function to open the modal for adding a new user
  const handleShowModal = () => {
    // Reset newUser to empty fields before opening the modal for adding
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
      id_rol: '1', // Default role when adding
      status: '1'  // Default status (Active) when adding
    });
    setIsEditing(false); // Set to adding mode
    setShowModal(true);  // Show the modal
  };

  // Function to close the modal
  const handleCloseModal = () => setShowModal(false);
  // Function to open the modal for editing a user
  const handleEditUser = (user) => {
    setNewUser(user);  // Load the selected user's data into the form
    setIsEditing(true);  // Set to editing mode
    setShowModal(true);  // Show the modal
  };

  // Function to add a new user
  const handleAddUser = async () => {
    try {
      console.log("Sending data:", newUser);
      const response = await axios.post('http://192.168.0.131/addProfile.php', newUser);
      console.log("User added:", response.data);
      fetchUsers();  // Refresh the user list after adding
      setShowModal(false);  // Close the modal
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Function to update an existing user
  const handleUpdateUser = async () => {
    try {
      console.log("Sending data for update:", newUser);
      const response = await axios.post('http://192.168.0.131/updateProfile2.php', newUser);  // Update endpoint
      console.log("User updated:", response.data);
      fetchUsers();  // Refresh the user list after updating
      setShowModal(false);  // Close the modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Function to decide whether to add or update a user when saving changes
  const handleSaveChanges = () => {
    if (isEditing) {
      handleUpdateUser();  // If editing, update the user
    } else {
      handleAddUser();  // If adding, add a new user
    }
  };

  // Function to delete a user
  const handleDeleteUser = async (id_user) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {  // Confirmation before deletion
      try {
        const response = await axios.post('http://192.168.0.131/deleteProfile.php', { id_user });
        console.log("User deleted:", response.data);
        fetchUsers();  // Refresh the user list after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // UseEffect to fetch the user list when the component is mounted
  useEffect(() => {
    fetchUsers();  // Fetch users when the component loads
  }, []);  // Empty dependency array ensures it only runs once when the component mounts

  return (
    <div id="root">
      <Header /> 
      <main>
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
              <th>Zip Code</th>
              <th>Credit Card Name</th>
              <th>Credit Card Number</th>
              <th>Credit Card Expiration</th>
              <th>CVV</th>
              <th>Role</th>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit User' : 'Add New User'}</Modal.Title>  {/* Change modal title based on mode */}
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

