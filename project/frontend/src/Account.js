import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './header';
import Footer from './footer';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap'; // Import Bootstrap components, including Spinner for loading

function Account() {
    // State to store user profile data
    const [profile, setProfile] = useState(null);
    // State to control modal visibility
    const [showModal, setShowModal] = useState(false);
    // State to store the profile being edited
    const [editedProfile, setEditedProfile] = useState(null);
    // State to track loading status for the modal and save actions
    const [loading, setLoading] = useState(false); 
    // Navigation hook to redirect users if necessary
    const navigate = useNavigate();
    // Retrieve user email and password from localStorage
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    // Fetch profile data when the component loads or email/password changes
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch the profile from the server using the email and password
                const response = await axios.post('http://192.168.0.131/profile.php', { email, password });
                const data = response.data;
                // Handle error if there is a problem fetching the profile
                if (data.error) {
                    console.log('Error fetching profile:', data.error);
                    setProfile(null);
                } else {
                    // Set both profile and editable profile states with the fetched data
                    setProfile(data);
                    setEditedProfile(data); 
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setProfile(null);
            }
        };

        // Only fetch profile if email and password exist
        if (email && password) {
            fetchProfile();
        } else {
            setProfile(null);
        }
    }, [email, password]);

    // If the user is not logged in, show a message and login button
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

    // Function to handle when "Edit Profile" button is clicked, showing the modal
    const handleEditClick = () => {
        setShowModal(true);
        setLoading(false); // Reset loading state when opening modal
    };

    // Function to close the modal
    const handleClose = () => setShowModal(false);

    // Function to handle saving changes to the backend
    const handleSaveChanges = async () => {
        setLoading(true); // Set loading to true while saving

        try {
            // Send the updated profile data to the backend
            const response = await axios.post('http://192.168.0.131/updateProfile.php', editedProfile);

            // Handle errors if the update fails
            if (response.data.error) {
                alert('Error updating profile: ' + response.data.error);
            } else {
                // If the update is successful, update the profile in the state
                alert('Profile updated successfully.');
                setProfile(editedProfile); 
                setShowModal(false); // Close the modal after saving
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false); // Stop the loading spinner after the request is completed
        }
    };

    // Handle changes to the input fields in the modal
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Check if the input is for the expiration date and format it accordingly
        if (name === 'credit_card_exp') {
            let formattedValue = value.replace(/\D/g, ''); // Remove any non-numeric characters
            if (formattedValue.length > 2) {
                formattedValue = `${formattedValue.slice(0, 2)}-${formattedValue.slice(2, 6)}`; // Add hyphen between MM and YYYY
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

    return (
        <div>
            <Header />
            <main className="main">
                <h1>Your Profile</h1>
                <div className="account-container">
                    <h2>My Account</h2>
                    <div className="account-profile">
                        <div className="profile-pic">
                            <img src="https://img.icons8.com/ios-filled/50/000000/user-male-circle.png" alt="Profile" />
                        </div>
                        {/* Button to open the edit profile modal */}
                        <button className="edit-profile-btn" onClick={handleEditClick} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Edit Profile'}
                        </button>
                    </div>

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

                        <div className="details-section">
                            <p>Role: {profile.id_rol === '1' ? 'User' : profile.id_rol === '2' ? 'Employee' : 'Admin'}</p>
                            <p>Status: {profile.status === '1' ? 'Active' : 'Inactive'}</p>
                            <p>Last Login: {profile.last_login}</p>
                        </div>
                    </div>
                </div>

                {/* Modal for editing profile */}
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
                                    maxLength={7} // Limit to "MM-YYYY" format
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
                                    maxLength={4} // Limit CVV to 4 digits
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* Show loading spinner during save operation */}
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
