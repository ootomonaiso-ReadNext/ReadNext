import React, { useContext } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function HomePage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // 認証トークンを削除
    navigate('/login'); // ログイン画面へリダイレクト
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to the Home Page!
        </Typography>
        <Typography variant="h5" component="p">
          You have successfully logged in.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleLogout} 
          sx={{ mt: 4 }}
        >
          Log Out
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
