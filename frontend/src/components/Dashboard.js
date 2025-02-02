// src/components/Dashboard.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  return (
    <Card 
      sx={{ 
        maxWidth: 600, 
        margin: '20px auto', 
        padding: 2,
        backgroundColor: 'grey.100',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          Funding Recommendations
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
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
          <Box textAlign="center" sx={{ marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Get Recommendations'}
            </Button>
          </Box>
        </Box>
        {errorMsg && (
          <Typography color="error" sx={{ marginTop: 2, textAlign: 'center' }}>
            {errorMsg}
          </Typography>
        )}
        {recommendation && (
          <Box sx={{ marginTop: 2, padding: 2, backgroundColor: 'white', borderRadius: 1 }}>
            <Typography variant="subtitle1" align="center">Recommendation:</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {recommendation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;