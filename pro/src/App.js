import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserSetting from "./pages/UserSetting";
import UserBookshelfPage from "./pages/UserBookshelfPage";
import AddBookFromDatabasePage from "./pages/AddBookFromDatabasePage";
import BookSearchPage from "./pages/BookSearchPage";
import ThreadListPage from "./pages/ThreadListPage";
import NewThreadPage from "./pages/NewThreadPage";
import ThreadPage from "./pages/ThreadPage";
import UserMake from "./pages/UserMake";
import PasswordReset from "./pages/PasswordReset"; 
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 公開ルート（認証不要） */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/usermake" element={<UserMake />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 保護されたルート（認証が必要） */}
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

        {/* 404ページ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

// 404ページコンポーネント
const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - ページが見つかりません</h1>
      <p>申し訳ありませんが、お探しのページは存在しません。</p>
    </div>
  );
};

export default App;
