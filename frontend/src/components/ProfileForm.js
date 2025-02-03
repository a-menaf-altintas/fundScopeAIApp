import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    name: '',
    company: '',
    sector: '',
    fundingNeeds: '',
    growthStage: ''
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/create', profile);
      alert('Profile Created Successfully!');
      setProfile({
        name: '',
        company: '',
        sector: '',
        fundingNeeds: '',
        growthStage: ''
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile. Check console for details.');
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
        boxShadow: 3,
        borderRadius: 2,
        p: 2
      }}
    >
      <CardContent>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
          Create Your Profile
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          Fill in your details to help us tailor funding opportunities for you.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            placeholder="John Doe"
            value={profile.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="company"
            label="Company Name"
            placeholder="ABC Innovations"
            value={profile.company}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="sector"
            label="Sector"
            placeholder="Fintech, Biotech, etc."
            value={profile.sector}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="fundingNeeds"
            label="Funding Needs"
            type="number"
            placeholder="500000"
            value={profile.fundingNeeds}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="growthStage"
            label="Growth Stage"
            placeholder="Pre-Seed, Seed, Series A..."
            value={profile.growthStage}
            onChange={handleChange}
          />

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Create Profile
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
