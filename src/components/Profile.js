import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Load user's shared places
      const userPlaces = JSON.parse(localStorage.getItem('places')) || [];
      setPlaces(userPlaces.filter(place => place.userId === user.id));
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user && (
        <div className="user-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <h3>Your Shared Places</h3>
      {places.length > 0 ? (
        <ul className="place-list">
          {places.map((place, index) => (
            <li key={index} className="place-item">
              <h4>{place.place}</h4>
              <img src={place.imageUrl} alt={place.place} />
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't shared any places yet.</p>
      )}
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default Profile;
