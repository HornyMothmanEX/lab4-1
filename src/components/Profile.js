import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editPlace, setEditPlace] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Load user's shared places
      const userPlaces = JSON.parse(localStorage.getItem('places')) || [];
      setPlaces(userPlaces.filter((place) => place.userId === user.id));
    }
  }, [user, navigate]);

  // Handle adding a new place
  const handleAddPlace = (e) => {
    e.preventDefault();
    if (!newPlace || !newImageUrl) {
      alert('Please enter both a place name and an image URL.');
      return;
    }
    const newSharedPlace = {
      place: newPlace,
      imageUrl: newImageUrl,
      userId: user.id,
      lat: 0,
      lng: 0,
    };
    const updatedPlaces = [...places, newSharedPlace];
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
    setNewPlace('');
    setNewImageUrl('');
  };

  // Handle deleting a place
  const handleDeletePlace = (index) => {
    const updatedPlaces = places.filter((_, i) => i !== index);
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
  };

  // Handle editing a place
  const handleEditPlace = (index) => {
    setEditIndex(index);
    setEditPlace(places[index].place);
    setEditImageUrl(places[index].imageUrl);
  };

  // Handle saving edited place
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedPlaces = [...places];
    updatedPlaces[editIndex] = {
      ...updatedPlaces[editIndex],
      place: editPlace,
      imageUrl: editImageUrl,
    };
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
    setEditIndex(null); // Clear the edit mode
  };

  // Handle logout
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

      {/* List of shared places */}
      {places.length > 0 ? (
        <ul className="place-list">
          {places.map((place, index) => (
            <li key={index} className="place-item">
              {editIndex === index ? (
                // Edit mode
                <div className="edit-place-form">
                  <input
                    type="text"
                    placeholder="Edit place name"
                    value={editPlace}
                    onChange={(e) => setEditPlace(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Edit image URL"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                </div>
              ) : (
                // Normal view
                <>
                  <h4>{place.place}</h4>
                  <img src={place.imageUrl} alt={place.place} style={{ width: '150px' }} />
                  <button onClick={() => handleEditPlace(index)}>Edit</button>
                  <button onClick={() => handleDeletePlace(index)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't shared any places yet.</p>
      )}

      {/* Add new place form */}
      <h3>Add a New Place</h3>
      <form onSubmit={handleAddPlace}>
        <input
          type="text"
          placeholder="Enter place name"
          value={newPlace}
          onChange={(e) => setNewPlace(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <button type="submit">Add Place</button>
      </form>

      {/* Logout button */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default Profile;
