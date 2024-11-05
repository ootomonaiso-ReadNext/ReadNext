import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
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
    <Container maxWidth="md">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            ReadNext
          </Typography>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link to="/login" style={{ color: "inherit", textDecoration: "none" }}>
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={user?.photoURL || defaultAvatar}
                alt="User Avatar"
                style={{ marginRight: "10px" }}
              />
              <Typography variant="h6">
                {user ? `Welcome, ${user.email}` : "Please log in"}
              </Typography>
            </CardContent>
            <CardActions>
              {user && (
                <Link to="/user-settings" style={{ textDecoration: "none" }}>
                  <Button size="small" color="primary">
                    Profile Settings
                  </Button>
                </Link>
              )}
            </CardActions>
          </Card>
        </Grid>

        {/* あなたの本棚へ行く セクション */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" style={{ marginBottom: "10px" }}>
                あなたの本棚へ行く
              </Typography>
              <Typography variant="body1">
                あなたの蔵書を一覧表示し、編集や追加ができます。やったね！
              </Typography>
            </CardContent>
            <CardActions>
              <Link to="/bookshelf" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="secondary">
                  本棚へ行く
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
