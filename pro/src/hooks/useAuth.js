import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../api/api';
import { signInWithGoogle } from '../firebase/firebaseConfig';

export const useAuth = () => {
  const { authToken, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = useCallback(async () => {
    try {
      const token = await signInWithGoogle();
      const response = await googleLogin(token);
      login(response.data.token);
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
    }
  }, [login, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return {
    isAuthenticated: !!authToken,
    authToken,
    handleLogin,
    handleLogout,
  };
};
