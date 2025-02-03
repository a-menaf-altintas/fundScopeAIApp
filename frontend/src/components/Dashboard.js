import React, { useState } from 'react';
import axios from 'axios';
/**
 * We use similar Material-UI components as before:
 * Card, CardContent, Typography, Box, Button, TextField, etc.
 */
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * The handleSubmit logic is mostly unchanged:
   * We send userProfile data to the backend (via /api/llama/recommend),
   * then store the AI’s response in `recommendation`.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setRecommendation('');

    try {
      const response = await axios.post('/api/llama/recommend', { userProfile });
      if (response.data && response.data.recommendation) {
        setRecommendation(response.data.recommendation);
      } else {
        setErrorMsg('No recommendation received. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      setErrorMsg('Error fetching recommendation. Please check your console for details.');
    }
    setLoading(false);
  };

  /**
   * CHANGED: We apply a consistent card style with boxShadow, borderRadius,
   * and color consistent with the theme/paper surfaces.
   * Also we keep spacing inside the Card with margins/padding.
   */
  return (
    <Card
      style={{
        maxWidth: 600,
        margin: '32px auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: 8
      }}
    >
      <CardContent>
        <Typography variant="h5" align="center" style={{ fontWeight: 'bold', marginBottom: 16 }}>
          Funding Recommendations
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate style={{ marginBottom: 16 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="Enter your company profile"
            placeholder="Provide details about your company and funding needs..."
            value={userProfile}
            onChange={(e) => setUserProfile(e.target.value)}
          />
          <Box style={{ textAlign: 'center', marginTop: 16 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Get Recommendations'}
            </Button>
          </Box>
        </Box>

        {errorMsg && (
          <Typography color="error" style={{ marginTop: 16, textAlign: 'center' }}>
            {errorMsg}
          </Typography>
        )}

        {recommendation && (
          <Box
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: '#f2f2f2',
              borderRadius: 4
            }}
          >
            <Typography variant="subtitle1" align="center" style={{ fontWeight: 600 }}>
              Recommendation:
            </Typography>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
              {recommendation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
