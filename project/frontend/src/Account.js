import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom'; 
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; 



function Account(){

    const [profile, setProfile] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        address: '',
        country: '',
        zipcode: '',
        credit_card_name: '',
        credit_card_number: '',
        cvv: ''
    });

    const [showModal, setShowModal] = useState(false); // it will control the estatus of the modal
    const [editedProfile, setEditedProfile] = useState({ ...profile }); // Copia del perfil para editar

    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');


    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
          const response = await axios.post('http:/192.168.0.8/profile.php', { email, password });
          console.log(response.data);  // Agrega este console.log para ver la respuesta
          setProfile(response.data); // Guardar los datos obtenidos en el estado
          setEditedProfile(response.data);
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        }
      };
    
      // Cargar los datos del usuario al montar el componente
      useEffect(() => {
        if (email && password) {
        fetchProfile();}
      }, []);

      const handleEditClick = () => {
        setShowModal(true);
      };

      const handleClose = () => {
        setShowModal(false);
      };

      // Guardar los cambios
  const handleSaveChanges = async () => {
    try {
      await axios.post('http://192.168.0.8/updateProfile.php', editedProfile); // Llamada al backend para actualizar los datos
      setProfile(editedProfile); // Actualizar el perfil en el frontend
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
    }
  };

       // Manejar los cambios en los campos del formulario dentro del modal
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

      if (!email || !password) {
        return (
          <div>
            <Header />
            <main className="main">
              <h1>Guest Access</h1>
              <p>You do not have an account yet. Please log in to access your profile.</p>
              <button onClick={() => navigate('/')}>Go to Login</button> 
            </main>
            <Footer />
          </div>
        );
      }

    return (
      <div> 
        <Header />
          <main className="main">
           <h1> Your profile</h1>
           <div className="account-container">
      <h2>My Account</h2>
      <div className="account-profile">
        <div className="profile-pic">
          <img src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png" alt="Profile" />
        </div>
        <button className="edit-profile-btn" onClick={handleEditClick} >Edit Profile</button>
      </div>

      <div className="account-details">
        <div className="details-section">
          <h4>Name</h4>
          <p>{profile.name}</p>  {/* Mostrar el nombre real */}
          <h4>Lastname</h4>
          <p>{profile.lastname}</p>  {/* Mostrar el apellido real */}
          <h4>Email</h4>
          <p>{profile.email}</p>  {/* Mostrar el email real */}
          <h4>Password</h4>
          <p>{profile.password}</p>  {/* Mostrar el email real */}
        </div>

        <div className="details-section">
          <h4>Shipping Address</h4>
          <p>{profile.address}</p>  {/* Mostrar la dirección real */}
          <p>Country: {profile.country}</p>  {/* Mostrar el país real */}
          <p>Zip Code: {profile.zipcode}</p>  {/* Mostrar el código postal real */}
        </div>

        <div className="details-section">
          <h4>Name of the Credit Card</h4>
          <p>{profile.credit_card_name}</p>  {/* Mostrar el nombre de la tarjeta */}
          <p>Credit Card Number: {profile.credit_card_number}</p>  {/* Mostrar el número de tarjeta */}
          <p>CVV: {profile.cvv}</p>  {/* Mostrar el CVV */}
        </div>
      </div>
    </div>
    {/* Modal para editar perfil */}
    <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={editedProfile.name} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Lastname</label>
                <input type="text" name="lastname" value={editedProfile.lastname} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={editedProfile.email} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={editedProfile.password} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <input type="text" name="address" value={editedProfile.address} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" name="country" value={editedProfile.country} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input type="text" name="zipcode" value={editedProfile.zipcode} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Credit Card Name</label>
                <input type="text" name="credit_card_name" value={editedProfile.credit_card_name} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Credit Card Number</label>
                <input type="text" name="credit_card_number" value={editedProfile.credit_card_number} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" name="cvv" value={editedProfile.cvv} onChange={handleInputChange} className="form-control" />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        
          </main>
      <Footer /> </div>
    );
  }
export default Account;
