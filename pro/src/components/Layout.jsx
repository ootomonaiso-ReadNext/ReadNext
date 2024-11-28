import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
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
} from "@mui/icons-material";

const Layout = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {isMobile ? (
        // スマホ版
        <>
          <Box
            component="main"
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "grey.100", // 背景色（必要に応じて変更）
              px: 2,
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
        <Box sx={{ display: "flex" }}>
          <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              width: 240,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
                boxSizing: "border-box",
                bgcolor: "white",
              },
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: "center", py: 2, fontWeight: "bold" }}
            >
              ReadNext
            </Typography>
            <List>
              <ListItem button component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="ホーム" />
              </ListItem>
              <ListItem button component={Link} to="/bookshelf">
                <ListItemIcon>
                  <BookshelfIcon />
                </ListItemIcon>
                <ListItemText primary="本棚" />
              </ListItem>
              <ListItem button component={Link} to="/book-search">
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="検索" />
              </ListItem>
              {user && (
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="ログアウト" />
                </ListItem>
              )}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              flex: 1,
              bgcolor: "grey.100", // 背景色（統一）
              p: 3,
            }}
          >
            {children || (
              <Typography>PC版: コンテンツがありません。</Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
