import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { authToken, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = useCallback(async (token) => {
    login(token);
    navigate('/');
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
