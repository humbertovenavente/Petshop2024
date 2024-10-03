import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; 

function Account() {
    const [profile, setProfile] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        address: '',
        city: '',
        country: '',
        zipcode: '',
        credit_card_name: '',
        credit_card_number: '',
        credit_card_exp: '',
        cvv: '',
        status: '',
        last_login: '',
        telephone: ''
    });

    const [showModal, setShowModal] = useState(false); 
    const [editedProfile, setEditedProfile] = useState({ ...profile }); 

    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const navigate = useNavigate();

    // Fetch profile data from API and handle undefined values
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.post('http://192.168.0.10/profile.php', { email, password });
                const data = response.data;

                // Handling undefined/null values
                setProfile({
                    name: data.name || '',
                    lastname: data.lastname || '',
                    email: data.email || '',
                    password: data.password || '',
                    address: data.address || '',
                    city: data.city || '',
                    country: data.country || '',
                    zipcode: data.zipcode || '',
                    credit_card_name: data.credit_card_name || '',
                    credit_card_number: data.credit_card_number || '',
                    credit_card_exp: data.credit_card_exp || '',
                    cvv: data.cvv || '',
                    status: data.status || '',
                    last_login: data.last_login || '',
                    telephone: data.telephone || ''
                });

                setEditedProfile(data); 
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        if (email && password) {
            fetchProfile();
        }
    }, [email, password]);

    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    // Save changes to backend
    const handleSaveChanges = async () => {
        try {
            await axios.post('http://192.168.0.10/updateProfile.php', editedProfile); 
            setProfile(editedProfile); 
            setShowModal(false); 
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    };

    // Handle input changes in the form
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
                            <p>{profile.name}</p>
                            <h4>Lastname</h4>
                            <p>{profile.lastname}</p>
                            <h4>Email</h4>
                            <p>{profile.email}</p>
                            <h4>Password</h4>
                            <p>{profile.password}</p>
                            <h4>Telephone</h4>
                            <p>{profile.telephone}</p>
                        </div>

                        <div className="details-section">
                            <h4>Shipping Address</h4>
                            <p>{profile.address}</p>
                            <p>City: {profile.city}</p>
                            <p>Country: {profile.country}</p>
                            <p>Zip Code: {profile.zipcode}</p>
                        </div>

                        <div className="details-section">
                            <h4>Name of the Credit Card</h4>
                            <p>{profile.credit_card_name}</p>
                            <p>Credit Card Number: {profile.credit_card_number}</p>
                            <p>Credit Card Expiration Date: {profile.credit_card_exp}</p>
                            <p>CVV: {profile.cvv}</p>
                        </div>

                        <div className="details-section">
                            <p>Status: {profile.status}</p>
                            <p>Last Login: {profile.last_login}</p>
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
                                <input type="text" name="name" value={editedProfile.name || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Lastname</label>
                                <input type="text" name="lastname" value={editedProfile.lastname || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={editedProfile.email || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" value={editedProfile.password || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Shipping Address</label>
                                <input type="text" name="address" value={editedProfile.address || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" value={editedProfile.city || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input type="text" name="country" value={editedProfile.country || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Zip Code</label>
                                <input type="text" name="zipcode" value={editedProfile.zipcode || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Telephone</label>
                                <input type="text" name="telephone" value={editedProfile.telephone || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Credit Card Name</label>
                                <input type="text" name="credit_card_name" value={editedProfile.credit_card_name || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Credit Card Number</label>
                                <input type="text" name="credit_card_number" value={editedProfile.credit_card_number || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Credit Card Expiration date</label>
                                <input type="text" name="credit_card_exp" value={editedProfile.credit_card_exp || ""} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input type="text" name="cvv" value={editedProfile.cvv || ""} onChange={handleInputChange} className="form-control" />
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
            <Footer /> 
        </div>
    );
}

export default Account;

