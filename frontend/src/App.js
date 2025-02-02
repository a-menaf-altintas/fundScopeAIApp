// src/App.js
import React from 'react';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import { Container, Typography, Box } from '@mui/material';

function App() {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          FundScope AI
        </Typography>
      </Box>
      <ProfileForm />
      <hr />
      <Dashboard />
    </Container>
  );
}

export default App;