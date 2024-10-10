import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate, Navigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem('users'));
    const foundUser = userData?.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      navigate('/profile');
    } else {
      alert('Invalid credentials!');
    }
  };

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
