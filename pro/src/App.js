import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserSetting from './pages/UserSetting';
import UserBookshelfPage from './pages/UserBookshelfPage';
import AddBookFromDatabasePage from './pages/AddBookFromDatabasePage';
import BookSearchPage from './pages/BookSearchPage'; 
import ThreadListPage from './pages/ThreadListPage';
import NewThreadPage from "./pages/NewThreadPage";
import ThreadPage from "./pages/ThreadPage"; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
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
        <Route
          path="/book-search"
          element={
            <ProtectedRoute>
              <BookSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:bookId/threads"
          element={
            <ProtectedRoute>
              <ThreadListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:bookId/new-thread"
          element={
            <ProtectedRoute>
              <NewThreadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:bookId/threads/:threadId"
          element={
            <ProtectedRoute>
              <ThreadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:bookId/threads/:threadId/comments"
          element={
            <ProtectedRoute>
              <ThreadPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
