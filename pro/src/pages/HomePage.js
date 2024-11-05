import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import defaultAvatar from "../img/deficon.png"; 

const HomePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Home Page</h2>
      {user ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
          <Link to="/user-settings" style={{ marginLeft: "10px" }}>
            <img
              src={user.photoURL || defaultAvatar} // アイコン画像またはデフォルト画像
              alt="User Avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginLeft: "10px",
                cursor: "pointer"
              }}
            />
          </Link>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};

export default HomePage;
