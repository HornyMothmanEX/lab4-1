import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Import the modal component

function Home() {
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user
  const [showModal, setShowModal] = useState(false); // Track if modal is visible

  useEffect(() => {
    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);

    // Get shared places from localStorage
    const storedPlaces = JSON.parse(localStorage.getItem('places')) || [];
    setPlaces(storedPlaces);
  }, []);

  // Function to handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowModal(true); // Open the modal
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null); // Clear selected user
  };

  // Filter places based on selected user
  const filteredPlaces = selectedUser 
    ? places.filter(place => place.userId === selectedUser.id) 
    : [];

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Discover and share amazing places with friends!</p>

      {/* List of Users */}
      <h2>List of Users</h2>
      {users.length > 0 ? (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item" onClick={() => handleUserSelect(user)} style={{ cursor: 'pointer' }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}

      {/* Modal to Show Shared Places for Selected User */}
      {selectedUser && (
        <Modal 
          show={showModal} 
          handleClose={handleCloseModal} 
          user={selectedUser} 
          places={filteredPlaces} 
        />
      )}
    </div>
  );
}

export default Home;
