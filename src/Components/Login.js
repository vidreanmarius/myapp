import React, { useState, useEffect } from "react";
import loginApi from '../Api/LoginApi';
import '../Styles/Login.css';
import { HOME_ROUTE } from '../Utils/UrlConstants';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await loginApi(username, password);
      if (response && response.token) {
        const decoded = jwtDecode(response.token);
        console.log(decoded);
        
        const userRole = decoded.role || ''; 
        const userId = decoded.userId || '';
  
        setUserRole(userRole);
        setLoggedIn(true);
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', response.token);
        navigate(HOME_ROUTE);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userRole")) navigate(HOME_ROUTE);
  }, [localStorage.getItem("userRole")]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;