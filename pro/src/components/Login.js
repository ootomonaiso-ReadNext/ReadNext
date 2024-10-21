// src/Login.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // 仮の認証処理
    setIsAuthenticated(true);
    navigate('/home'); // ログイン成功後、ホーム画面へ遷移
  };

  return (
    <Container maxWidth="sm">
      <Box 
        component="form" 
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }} 
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          required
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Log In
        </Button>
        
        {/* 追加されたアカウント作成ボタン */}
        <Button 
          component={Link} 
          to="/register" 
          variant="outlined" 
          color="secondary" 
          fullWidth
        >
          Create Account
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
