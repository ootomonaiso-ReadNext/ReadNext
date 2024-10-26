import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { Button, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function HomePage() {
  const { isAuthenticated, handleLogout } = useAuth();
  const { authToken } = useContext(AuthContext);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {isAuthenticated ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>ようこそ！</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>トークン: {authToken}</Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={handleLogout}
          >
            ログアウト
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>ログインが必要です</Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary"
          >
            ログインページへ
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default HomePage;
