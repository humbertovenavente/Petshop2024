import Header from './header';
import Footer from './footer';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserAdmin() {

    const [user, setUser] = useState([]);
    

    // Función para obtener los usuarios desde el backend
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://192.168.0.10/user.php');
            console.log("Respuesta de la API:", response.data); // Depuración para ver los datos devueltos
            if (Array.isArray(response.data)) {
                setUser(response.data);  // Guardar los usuarios en el estado si es un array
            } else {
                console.error("La respuesta no es un array:", response.data);
            }
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
          <button className="edit-profile-btn"  >Add New Profile</button>
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
                    <th>zipcode</th>
                    <th>credit_card_name</th>
                    <th>credit_card_number</th>
                    <th>credit_card_exp</th>
                    <th>CVV</th>
                    <th>Status</th>
                    <th>Last Login</th>
                   
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
                            <td>{user.telephone}</td>
                            <td>{user.address}</td>
                            <td>{user.city}</td>
                            <td>{user.country}</td>
                            <td>{user.zipcode}</td>
                            <td>{user.credit_card_name}</td>
                            <td>{user.credit_card_number}</td>
                            <td>{user.credit_card_exp}</td>
                            <td>{user.cvv}</td>
                            <td>{user.status}</td>
                            <td>{user.last_login}</td>
                            <td> <button className="edit-profile-btn"  >Edit</button></td>
                            <td> <button className="edit-profile-btn"  >Delete</button></td>
                            <td> <button className="edit-profile-btn"  >Status</button></td>
                           
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9">No users found</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default UserAdmin;
