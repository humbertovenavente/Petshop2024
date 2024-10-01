import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom'; 
import Header from './header';
import Footer from './footer';
import axios from 'axios';



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

    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');


    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
          const response = await axios.post('http://172.16.72.12/profile.php', { email, password });
          console.log(response.data);  // Agrega este console.log para ver la respuesta
          setProfile(response.data); // Guardar los datos obtenidos en el estado
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
        }
      };
    
      // Cargar los datos del usuario al montar el componente
      useEffect(() => {
        if (email && password) {
        fetchProfile();}
      }, []);

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
        <button className="edit-profile-btn">Edit Profile</button>
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
        
          </main>
      <Footer /> </div>
    );
  }
export default Account
