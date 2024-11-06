import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./components/pages/HomePage"
import Login from "./components/pages/Login"
import Register from "./components/pages/Register"
import UserMake from "./components/pages/UserMake"
import UserSetting from "./components/pages/UserSetting"
import UserBookshelfPage from "./components/pages/UserBookshelfPage"
import ProtectedRoute from "./components/ui/ProtectedRoute"
import { AuthProvider } from "./provider/AuthProvider"
import AddBookFromDatabasePage from "./components/pages/AddBookFromDatabasePage"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
