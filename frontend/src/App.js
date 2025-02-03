import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import UnifiedInput from './components/UnifiedInput';

/**
 * NOTE: If you have a brand logo (e.g. logo.png) in `public/` or `src/assets/`,
 * you can import and display it. Example:
 *
 * import logo from './assets/logo.png';
 *
 * Then place <img src={logo} alt="FundScope Logo" ... /> in the AppBar.
 */

function App() {
  return (
    /**
     * We use a Box to serve as the page's background container.
     * minHeight: '100vh' ensures it covers the full browser height.
     */
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        // A gentle linear gradient background:
        background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)'
      }}
    >
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#007bff' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          {/* 
            CHANGED: Larger variant, bold if desired
            If you have a logo, you could place it to the left, for example.
          */}
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {/* <img src={logo} alt="FundScope Logo" style={{ height: 32, marginRight: 8 }} /> */}
            FundScope AI
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flexGrow: 1, mt: 4 }}>
        {/* UnifiedInput is our main AI interface */}
        <UnifiedInput />
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 'auto', py: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} FundScope AI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
