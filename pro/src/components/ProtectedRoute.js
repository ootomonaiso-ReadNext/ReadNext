import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // 未ログインの場合、ログインページへリダイレクト
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ログイン済みの場合、子コンポーネント（トップページ）を表示
  return children;
};

export default ProtectedRoute;
