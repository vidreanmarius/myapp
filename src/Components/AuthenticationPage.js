import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="authentication-page">
      {isLogin ? (
        <div>
          <Login />
          <p>
            Don't have an account?{' '}
            <button onClick={handleSwitch}>Register</button>
          </p>
        </div>
      ) : (
        <div>
          <Register />
          <p>
            Already have an account?{' '}
            <button onClick={handleSwitch}>Login</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthenticationPage;