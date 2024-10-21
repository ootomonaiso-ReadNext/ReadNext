import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Home Page
        </Typography>
        <Typography variant="body1">
          This is a simple homepage for users who have successfully logged in.
        </Typography>
      </Box>
    </Container>
  );
}

export default HomePage;
