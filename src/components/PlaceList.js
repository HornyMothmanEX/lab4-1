import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';

function PlaceList() {
  const [places, setPlaces] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const storedPlaces = JSON.parse(localStorage.getItem('places')) || [];
    setPlaces(storedPlaces);
  }, []);

  const handleDelete = (index) => {
    const updatedPlaces = places.filter((_, i) => i !== index);
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
  };

  return (
    <div className="place-list-container">
      <h2>Places</h2>
      {places.length > 0 ? (
        <ul className="place-list">
          {places.map((place, index) => (
            <li key={index} className="place-item">
              <div className="place-info">
                <h3>{place.place}</h3>
                <p>Shared by: {place.userId}</p>
                {place.lat !== undefined && place.lng !== undefined ? (
                  <p>Coordinates: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}</p>
                ) : (
                  <p>Coordinates: Not available</p>
                )}
              </div>
              <div className="place-image">
                {place.imageUrl && <img src={place.imageUrl} alt={place.place} />}
              </div>
              <button onClick={() => handleDelete(index)} className="delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No places have been shared yet.</p>
      )}
    </div>
  );
}

export default PlaceList;
