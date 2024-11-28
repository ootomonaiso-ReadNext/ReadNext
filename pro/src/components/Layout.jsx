import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

const Layout = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  const handleGoBack = () => {
    if (location.key !== "default") {
      navigate(-1); // 直前のページに戻る
    } else {
      navigate("/"); // 戻る履歴がない場合はホームに移動
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "grey.100" }}>
      {/* ヘッダー */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          {/* 戻るボタン */}
          <IconButton color="inherit" onClick={handleGoBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>

          <BookmarkIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            ReadNext
          </Typography>

          {/* ページ遷移ボタン */}
          {user && (
            <>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{ mr: 2 }}
              >
                ホーム
              </Button>
              <Button
                component={Link}
                to="/bookshelf"
                color="inherit"
                sx={{ mr: 2 }}
              >
                本棚
              </Button>
              <Button
                component={Link}
                to="/book-search"
                color="inherit"
                sx={{ mr: 2 }}
              >
                本を検索
              </Button>
            </>
          )}

          {/* ログイン/ログアウトボタン */}
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
      <Box component="main" sx={{ flex: 1, mt: 2 }}>
        {children}
      </Box>

      {/* フッター */}
      <Box component="footer" sx={{ py: 2, bgcolor: "primary.main", color: "white", textAlign: "center" }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} ReadNext. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
