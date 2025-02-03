import React, { useState } from 'react';
import axios from 'axios';
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
      setErrorMsg('Error fetching recommendation. Check console for details.');
    }
    setLoading(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <CardContent>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
          Funding Recommendations
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          Enter your company profile below to get targeted funding options.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="Company Profile"
            placeholder="Example: 'We are a biotech startup seeking $1M to develop ...'"
            value={userProfile}
            onChange={(e) => setUserProfile(e.target.value)}
          />
          <Box sx={{ textAlign: 'center', mt: 2 }}>
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
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {errorMsg}
          </Typography>
        )}

        {recommendation && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: '#e8f4fa',
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Typography variant="subtitle1" align="center" sx={{ fontWeight: 600 }}>
              Recommendation:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
              {recommendation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
