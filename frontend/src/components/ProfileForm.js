// src/components/ProfileForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material';

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
        margin: '20px auto', 
        padding: 2,
        backgroundColor: 'grey.100',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          Create Your Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={profile.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="company"
            label="Company Name"
            value={profile.company}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="sector"
            label="Sector"
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
            value={profile.fundingNeeds}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="growthStage"
            label="Growth Stage"
            value={profile.growthStage}
            onChange={handleChange}
          />
          <Box textAlign="center" sx={{ marginTop: 2 }}>
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