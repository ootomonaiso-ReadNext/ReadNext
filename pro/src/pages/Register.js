import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/api'; // サービスからのインポート
import { TextField, Button, Container, Typography, Box } from '@mui/material';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await register(username, email, password);
      alert('User registered successfully');
      navigate('/login'); // 登録後にログインページへリダイレクト
    } catch (error) {
      console.error('Registration failed', error);
      alert('Failed to register user');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>Register</Typography>
        <TextField label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
        <TextField label="Email" type="email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
        <TextField label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
        <TextField label="Confirm Password" type="password" variant="outlined" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth />
        <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
      </Box>
    </Container>
  );
}

export default Register;
