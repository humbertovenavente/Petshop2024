
import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserAdmin() {

    const [users, setUsers] = useState([]);

    // Función para obtener los usuarios desde el backend
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://192.168.0.8/users.php');
            setUsers(response.data);  // Guardar los usuarios en el estado
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    useEffect(() => {
        fetchUsers();  // Llamar a la función al cargar el componente
    }, []);


  return (
    <div>

      <Header />

      <div>
            <h1>List of Clients</h1>

            <div className="account-profile">
        <button className="edit-profile-btn"  >Edit Profile</button>
      </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Country</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.lastname}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.country}</td>
                            <td>{user.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>



      <Footer />
    </div>
  );
}

export default UserAdmin;
