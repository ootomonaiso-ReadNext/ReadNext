import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google'; // Googleアイコンの追加
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser, loginWithEmailAndPassword, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      const userCredential = await loginWithEmailAndPassword(email, password);
      setUser(userCredential.user);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await loginWithGoogle();
      setUser(userCredential.user);
      navigate("/");
    } catch (error) {
      console.error(error);
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
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
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
          Login with Email
        </Button>
        <Divider sx={{ my: 2 }}>or</Divider>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          startIcon={<GoogleIcon />} 
          onClick={handleGoogleLogin}
          sx={{ mb: 2 }}
        >
          Login with Google
        </Button>
        <Button
          variant="text"
          color="primary"
          fullWidth
          onClick={navigateToRegister}
        >
          Create a new account
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
