import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  MenuBook as MenuBookIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import defaultAvatar from "../img/deficon.png";
import Layout from "../components/Layout"; // レイアウトコンポーネント

const HomePage = () => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // 画面全体に対応
          bgcolor: "grey.100", // 背景色を調整
          px: 2, // レスポンシブ対応のパディング
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            py: 4,
            px: 3,
          }}
        >
          <Grid container spacing={3}>
            {/* ユーザー情報セクション */}
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

            {/* 本棚セクション */}
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
                  <Button
                    component={Link}
                    to="/book-search"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: "bold",
                      mt: 2,
                    }}
                  >
                    本を検索
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;
