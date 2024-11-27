import React, { useState } from "react";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google'; // Googleアイコンの追加

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      const userCredential = await loginWithEmail(email, password);
      setUser(userCredential.user);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await loginWithGoogle();
      setUser(userCredential.user);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          ログイン
        </Typography>
        <TextField
          label="Eメール"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="パスワード"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          onClick={handleEmailLogin}
        >
          電子メールでログイン
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          startIcon={<GoogleIcon />} 
          onClick={handleGoogleLogin}
          sx={{ mb: 2 }}
        >
          Googleでログイン
        </Button>
        <Button
          variant="text"
          color="primary"
          fullWidth
          onClick={navigateToRegister}
        >
          新規アカウント登録
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
