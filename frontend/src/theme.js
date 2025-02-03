import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',        // A bright blue for primary
    },
    secondary: {
      main: '#6c757d',        // A medium gray for secondary
    },
    background: {
      default: '#f8f9fa',     // Light gray background for the whole page
      paper: '#ffffff',       // White for cards and other surfaces
    },
  },
  shape: {
    borderRadius: 8,          // Slightly rounded corners for components
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
