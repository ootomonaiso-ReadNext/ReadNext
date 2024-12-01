import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  LibraryBooks as BookshelfIcon,
  Search as SearchIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

const Layout = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {!isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ReadNext
          </Typography>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        // スマホ版
        <>
          <Box
            component="main"
            sx={{
              flex: 2,
              display: "flex",
              justifyContent: "center",
              px: 2,
              mt: 8, // ヘッダーの高さ分の余白
            }}
          >
            {children || (
              <Typography>スマホ版: コンテンツがありません。</Typography>
            )}
          </Box>
          <BottomNavigation
            showLabels
            sx={{ position: "fixed", bottom: 0, width: "100%" }}
          >
            <BottomNavigationAction
              label="ホーム"
              icon={<HomeIcon />}
              component={Link}
              to="/"
            />
            <BottomNavigationAction
              label="本棚"
              icon={<BookshelfIcon />}
              component={Link}
              to="/bookshelf"
            />
            <BottomNavigationAction
              label="検索"
              icon={<SearchIcon />}
              component={Link}
              to="/book-search"
            />
            {user && (
              <BottomNavigationAction
                label="ログアウト"
                icon={<ExitToAppIcon />}
                onClick={handleLogout}
              />
            )}
          </BottomNavigation>
        </>
      ) : (
        // PC版
        <Box sx={{ display: "flex", mt: 8 /* ヘッダーの高さ分調整 */ }}>
          <Drawer
            variant="persistent"
            open={drawerOpen}
            anchor="left"
            sx={{
              width: drawerOpen ? 240 : 0,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerOpen ? 240 : 0,
                boxSizing: "border-box",
                transition: "width 0.3s",
                marginTop: "64px", // ヘッダーの高さ分下げる
              },
            }}
          >
            <List>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="ホーム" />
              </ListItemButton>
              <ListItemButton component={Link} to="/bookshelf">
                <ListItemIcon>
                  <BookshelfIcon />
                </ListItemIcon>
                <ListItemText primary="本棚" />
              </ListItemButton>
              <ListItemButton component={Link} to="/book-search">
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="検索" />
              </ListItemButton>
            </List>
            {user && (
              <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="ログアウト" />
                </ListItemButton>
              </Box>
            )}
          </Drawer>

          <Box
            component="main"
            sx={{
              flex: 1,
              p: 3,
              transition: "left 0.3s, padding 0.3s",
              display: "block", // メインコンテンツを左揃え
              width: "100%", // 幅を100%に設定
              maxWidth: drawerOpen ? "100%" : "960px", // サイドバーが閉じているときのみ制限
              boxSizing: "border-box", // 余計なスペースをなくす
            }}
          >
            <Box sx={{ width: "100%" }}>
              {children || <Typography>PC版: コンテンツがありません。</Typography>}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
