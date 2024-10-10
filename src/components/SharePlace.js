import React, { useState, useContext, useRef } from 'react';
import { UserContext } from '../App';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
}

function SharePlace() {
  const [place, setPlace] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [coordinates, setCoordinates] = useState([0, 0]);
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState(JSON.parse(localStorage.getItem('places')) || []);
  const [zoom, setZoom] = useState(2);
  const mapRef = useRef();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates([parseFloat(lat), parseFloat(lon)]);
        setZoom(13);
      } else {
        alert('Location not found. Please try a different name.');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('An error occurred while searching for the location.');
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to share a place.');
      return;
    }
    const newPlace = { 
      place, 
      imageUrl, 
      lat: coordinates[0], 
      lng: coordinates[1], 
      userId: user.id 
    };
    const updatedPlaces = [...places, newPlace];
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
    setPlace('');
    setImageUrl('');
    setCoordinates([0, 0]);
    setZoom(2);
  };

  return (
    <div className="share-place-container">
      <h2>Share a Place</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="Enter place name" 
          value={place} 
          onChange={(e) => setPlace(e.target.value)} 
          required 
        />
        <button type="submit">Search</button>
      </form>
      <MapContainer center={coordinates} zoom={zoom} ref={mapRef} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates} />
        <SetViewOnClick coords={coordinates} />
      </MapContainer>
      <form onSubmit={handleShare} className="share-form">
        <input 
          type="url" 
          placeholder="Image URL" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          required 
        />
        <p>Selected coordinates: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}</p>
        <button type="submit">Share</button>
      </form>
    </div>
  );
}

export default SharePlace;
