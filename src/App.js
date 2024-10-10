import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import PlaceList from './components/PlaceList';
import SharePlace from './components/SharePlace';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import './App.css';
import './index.css';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser: handleLogin }}>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/places">Places</Link></li>
              <li><Link to="/share">Share Place</Link></li>
              {user ? (
                <>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              )}
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<PlaceList />} />
            <Route path="/share" element={<SharePlace />} />
            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
