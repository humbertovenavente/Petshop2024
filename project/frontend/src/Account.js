import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';

function Account() {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);  // Modal para editar el perfil
    const [showPasswordModal, setShowPasswordModal] = useState(false);  // Modal para cambiar contraseña
    const [editedProfile, setEditedProfile] = useState(null);  // Estado para la edición del perfil
    const [loading, setLoading] = useState(false); 
    const [selectedFile, setSelectedFile] = useState(null);  // Imagen seleccionada
    const [fileType, setFileType] = useState('');  // Tipo de archivo (MIME type)
    const [showImageModal, setShowImageModal] = useState(false);  // Estado para controlar el modal de la imagen
    const [currentPassword, setCurrentPassword] = useState(''); // Contraseña actual
    const [newPassword, setNewPassword] = useState(''); // Nueva contraseña
    const [passwordVerified, setPasswordVerified] = useState(false); // Verificación de la contraseña actual
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    const navigate = useNavigate();

    // Funciones para mostrar el rol y los estados en texto
    const getRoleName = (id_rol) => {
        switch(id_rol) {
            case 1: return 'User';
            case 2: return 'Employee';
            case 3: return 'Admin';
            default: return 'Guest';
        }
    };

    const getStatusName = (status) => {
        return status === 1 ? 'Active' : 'Inactive';
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.post('http://192.168.0.14/profile.php', { email, password });
                const data = response.data;
                if (data.error) {
                    console.log('Error fetching profile:', data.error);
                    setProfile(null);
                } else {
                    setProfile(data);
                    setEditedProfile(data);  // Inicializar el perfil editable
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
                    <h1>Opps...</h1>
                    <p>You do not have an account yet. Please log in to access your profile.</p>
                    <div>
                        <Button onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>Go to Login</Button> 
                    </div>
                    <div>
                        <Button variant="success" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>Go to Home</Button> 
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Función para abrir el modal de edición
    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);  // Cerrar el modal de edición

    // Guardar cambios en el perfil
    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.14/updateProfile.php', JSON.stringify(editedProfile), {
                headers: { 'Content-Type': 'application/json' }
            });
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

    // Guardar la imagen en el backend
    const handleSavePhoto = async () => {
        setLoading(true);
        try {
            const updatedProfile = { ...profile, profile_pic: selectedFile.replace(/^data:image\/[a-z]+;base64,/, ''), file_type: fileType };
            const response = await axios.post('http://192.168.0.14/updateProfile.php', updatedProfile);

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

    // Eliminar la foto de perfil
    const handleDeletePhoto = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.14/deleteProfilePic.php', { email });

            if (response.data.error) {
                alert('Error deleting photo: ' + response.data.error);
            } else {
                alert('Photo deleted successfully.');
                setProfile({ ...profile, profile_pic: null });
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
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

    // Cambiar contraseña
    const handleChangePassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.14/verifyPassword.php', { email, currentPassword });

            if (response.data.error) {
                alert('Password incorrect.');
                setPasswordVerified(false);
            } else {
                setPasswordVerified(true);
            }
        } catch (error) {
            console.error('Error verifying password:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.14/updatePassword.php', { email, newPassword });

            if (response.data.error) {
                alert('Error updating password: ' + response.data.error);
            } else {
                alert('Password updated successfully.');
                setShowPasswordModal(false);
            }
        } catch (error) {
            console.error('Error updating password:', error);
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los campos del perfil editado
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div id="root">
        <Header />
        <main className="container my-5">
                <h1>Your Account</h1>
                <div className="account-container">
                    <h3>My Photo Profile</h3>
                    <div className="account-profile">
                        <div className="profile-pic">
                            {profile.profile_pic ? (
                                <img src={`data:${profile.file_type};base64,${profile.profile_pic}`} alt="Profile" style={{ width: '150px', height: '150px' }} />
                            ) : (
                                <p>No profile picture</p>
                            )}
                        </div>
                        <Button className="edit-profile-btn" onClick={handleEditClick}>
                            Edit Profile
                        </Button>
                        
                        <input type="file" onChange={handleFileChange} style={{ marginLeft: '30px' }} />

                        <Button variant='success' onClick={handleSavePhoto} disabled={loading || !selectedFile} style={{ marginLeft: '10px' }}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Save Photo'}
                        </Button>

                        <Button variant='danger' onClick={handleDeletePhoto} disabled={loading || !profile.profile_pic} style={{ marginLeft: '10px' }}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Delete Photo'}
                        </Button>

                        <Button onClick={handleShowImage} style={{ marginLeft: '10px' }}>
                            View Photo
                        </Button>
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
                    
                    <h2>My Information</h2>

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
                            <h4>Role</h4>
                            <p>{getRoleName(profile.id_rol)}</p>  {/* Mostrar rol como texto */}
                            <h4>Status</h4>
                            <p>{getStatusName(profile.status)}</p>  {/* Mostrar estado como texto */}
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

                        <Button variant='warning' onClick={() => setShowPasswordModal(true)} style={{ marginTop: '20px' }}>
                            Change Password
                        </Button>
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
                                    <label>Expiration Date (MM-YYYY)</label>
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
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges} disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal para cambiar la contraseña */}
                    <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Change Password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {!passwordVerified ? (
                                <div>
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <Button variant="primary" onClick={handleChangePassword} style={{ marginTop: '10px' }}>
                                        Verify Password
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <Button variant="success" onClick={handleUpdatePassword} style={{ marginTop: '10px' }}>
                                        Update Password
                                    </Button>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Account;
