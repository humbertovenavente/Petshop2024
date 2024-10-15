import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';

function Account() {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editedProfile, setEditedProfile] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [selectedFile, setSelectedFile] = useState(null);  // Estado para la imagen seleccionada
    const [fileType, setFileType] = useState('');  // Estado para el tipo de archivo (MIME type)
    const [showImageModal, setShowImageModal] = useState(false);  // Estado para controlar el modal de la imagen
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.post('http://192.168.0.131/profile.php', { email, password });
                const data = response.data;
                if (data.error) {
                    console.log('Error fetching profile:', data.error);
                    setProfile(null);
                } else {
                    setProfile(data);
                    setEditedProfile(data); 
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfile(null);
            }
        };

        if (email && password) {
            fetchProfile();
        } else {
            setProfile(null);
        }
    }, [email, password]);

    if (!email || !password || !profile) {
        return (
            <div id="root">
                <Header />
                <main className="main">
                    <h1>Guest Access</h1>
                    <p>You do not have an account yet. Please log in to access your profile.</p>
                    <button onClick={() => navigate('/login')}>Go to Login</button> 
                </main>
                <Footer />
            </div>
        );
    }

    const handleEditClick = () => {
        setShowModal(true);
        setLoading(false);
    };

    const handleClose = () => setShowModal(false);

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.131/updateProfile.php', editedProfile);
            if (response.data.error) {
                alert('Error updating profile: ' + response.data.error);
            } else {
                alert('Profile updated successfully.');
                setProfile(editedProfile); 
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'credit_card_exp') {
            let formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length > 2) {
                formattedValue = `${formattedValue.slice(0, 2)}-${formattedValue.slice(2, 6)}`;
            }
            setEditedProfile(prevState => ({
                ...prevState,
                [name]: formattedValue
            }));
        } else {
            setEditedProfile(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Función para manejar la selección de la imagen
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileType(file.type);  // Guardar el tipo de archivo (MIME type)
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(reader.result);  // Guardar la imagen como Base64
            };
            reader.readAsDataURL(file);  // Convertir la imagen a Base64
        }
    };

    // Función para guardar la imagen en el backend
    const handleSavePhoto = async () => {
        setLoading(true);
        try {
            const updatedProfile = { ...profile, profile_pic: selectedFile, file_type: fileType };  // Incluir la imagen y tipo en el perfil
            const response = await axios.post('http://192.168.0.131/updateProfile.php', updatedProfile);

            if (response.data.error) {
                alert('Error uploading photo: ' + response.data.error);
            } else {
                alert('Photo uploaded successfully.');
                setProfile(updatedProfile);
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowImage = () => {
        setShowImageModal(true);  // Mostrar el modal con la imagen
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);  // Cerrar el modal de la imagen
    };

    return (
        <div>
            <Header />
            <main className="main">
                <h1>Your Profile</h1>
                <div className="account-container">
                    <h2>My Account</h2>
                    <div className="account-profile">
                        <div className="profile-pic">
                            <img src={`data:${profile.file_type};base64,${profile.profile_pic}`} alt="Profile" style={{ width: '150px', height: '150px' }} />
                        </div>
                        <button className="edit-profile-btn" onClick={handleEditClick} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Edit Profile'}
                        </button>
                        
                        <input type="file" onChange={handleFileChange} style={{ marginLeft: '20px' }} />
                        <button onClick={handleSavePhoto} disabled={loading || !selectedFile} style={{ marginLeft: '10px' }}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Photo'}
                        </button>

                        <button onClick={handleShowImage} style={{ marginLeft: '10px' }}>
                            View Photo
                        </button>
                    </div>

                    {/* Modal para mostrar la imagen */}
                    <Modal show={showImageModal} onHide={handleCloseImageModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Your Profile Picture</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <img 
                                src={`data:${profile.file_type};base64,${profile.profile_pic}`} 
                                alt="Profile"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseImageModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div className="account-details">
                        <div className="details-section">
                            <h4>Name</h4>
                            <p>{profile.name}</p>
                            <h4>Lastname</h4>
                            <p>{profile.lastname}</p>
                            <h4>Email</h4>
                            <p>{profile.email}</p>
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
                            <h4>Credit Card Information</h4>
                            <p>Name on Card: {profile.credit_card_name}</p>
                            <p>Credit Card Number: {profile.credit_card_number}</p>
                            <p>Expiration Date: {profile.credit_card_exp}</p>
                            <p>CVV: {profile.cvv}</p>
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
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={editedProfile.name || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Lastname</label>
                                <input 
                                    type="text" 
                                    name="lastname" 
                                    value={editedProfile.lastname || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={editedProfile.email || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Telephone</label>
                                <input 
                                    type="text" 
                                    name="telephone" 
                                    value={editedProfile.telephone || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    value={editedProfile.address || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input 
                                    type="text" 
                                    name="city" 
                                    value={editedProfile.city || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input 
                                    type="text" 
                                    name="country" 
                                    value={editedProfile.country || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Zip Code</label>
                                <input 
                                    type="text" 
                                    name="zipcode" 
                                    value={editedProfile.zipcode || ""} 
                                    onChange={handleInputChange} 
                                    className="form-control" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Name on Card</label>
                                <input
                                    type="text"
                                    name="credit_card_name"
                                    value={editedProfile.credit_card_name || ''}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Credit Card Number</label>
                                <input
                                    type="text"
                                    name="credit_card_number"
                                    value={editedProfile.credit_card_number || ''}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    maxLength={16}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiration Date</label>
                                <input
                                    type="text"
                                    name="credit_card_exp"
                                    value={editedProfile.credit_card_exp || ''}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    maxLength={7} // Formato "MM-YYYY"
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={editedProfile.cvv || ''}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    maxLength={4} // Límite de 4 dígitos para CVV
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>   
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
            <Footer />
        </div>
    );
}

export default Account;
