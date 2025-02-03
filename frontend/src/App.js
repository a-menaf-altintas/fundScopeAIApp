import React from 'react';
import { Container, Box, AppBar, Toolbar, Typography } from '@mui/material';
import UnifiedInput from './components/UnifiedInput';

function App() {
  return (
    <>
      {/**
       * CHANGED: We centered the AppBar text by using
       *  style={{ display: 'flex', justifyContent: 'center' }}
       * within the <Toolbar> component.
       */}
      <AppBar position="static">
        <Toolbar style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" component="div">
            FundScope AI
          </Typography>
        </Toolbar>
      </AppBar>

      {/**
       * The rest of the layout remains the same:
       * We wrap our UnifiedInput component inside a Box with vertical margin
       * and a Container for proper horizontal alignment.
       */}
      <Box sx={{ my: 4 }}>
        <Container maxWidth="md">
          <UnifiedInput />
        </Container>
      </Box>
    </>
  );
}

export default App;
