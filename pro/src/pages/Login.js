import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (response.ok && data.token) {
        login(data.token);
        navigate('/');
      } else {
        console.error('ログインエラー:', data);
      }
    } catch (error) {
      console.error('Googleログインエラー:', error);
    }
  };

  const handleGoogleLoginFailure = () => {
    console.error('Googleログイン失敗');
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
        <TextField label="Username" variant="outlined" required fullWidth />
        <TextField label="Password" type="password" variant="outlined" required fullWidth />
        <Button type="submit" variant="contained" color="primary" fullWidth>Log In</Button>
        <Button component={Link} to="/register" variant="outlined" color="secondary" fullWidth>Create Account</Button>
        <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginFailure} useOneTap />
      </Box>
    </Container>
  );
}

export default Login;
