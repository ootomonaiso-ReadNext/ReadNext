import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";
import defaultAvatar from "../img/deficon.png";

const HomePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "grey.100" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <BookmarkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
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

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                color: "white",
              }}
            >
              <Avatar
                src={user?.photoURL || defaultAvatar}
                alt="User Avatar"
                sx={{
                  width: 60,
                  height: 60,
                  border: "3px solid white",
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {user ? `ようこそ、${user.email}さん` : "ログインしてください"}
                </Typography>
                {user && (
                  <Button
                    component={Link}
                    to="/user-settings"
                    startIcon={<SettingsIcon />}
                    sx={{ color: "white", mt: 1 }}
                  >
                    プロフィール設定
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Card
              elevation={3}
              sx={{
                position: "relative",
                overflow: "visible",
                "&:hover": {
                  transform: "translateY(-4px)",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <MenuBookIcon
                    sx={{
                      fontSize: 40,
                      color: theme.palette.secondary.main,
                      mr: 2,
                    }}
                  />
                  <Typography variant="h4" component="h2" fontWeight="bold">
                    あなたの本棚へ行く
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                >
                  あなたの蔵書を一覧表示し、編集や追加ができます。やったね！
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to="/bookshelf"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<BookmarkIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: "bold",
                  }}
                >
                  本棚へ移動
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;