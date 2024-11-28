import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

const Layout = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "grey.100" }}>
      {/* ヘッダー */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <BookmarkIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            ReadNext
          </Typography>
          {user ? (
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          ) : (
            <Button
              component={Link}
              to="/login"
              color="inherit"
              startIcon={<ExitToAppIcon />}
            >
              ログイン
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* ページ内容 */}
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Box>
  );
};

export default Layout;
