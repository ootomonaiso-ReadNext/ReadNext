import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserMake from './pages/UserMake';
import UserSetting from './pages/UserSetting';
import UserBookshelfPage from './pages/UserBookshelfPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usermake" element={<UserMake />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-settings"
            element={
              <ProtectedRoute>
                <UserSetting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookshelf"
            element={
              <ProtectedRoute>
                <UserBookshelfPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-from-database"
            element={
              <ProtectedRoute>
                <AddBookFromDatabasePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
