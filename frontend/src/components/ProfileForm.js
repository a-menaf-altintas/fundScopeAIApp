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
  /**
   * Store the fields for the user profile in local state.
   */
  const [profile, setProfile] = useState({
    name: '',
    company: '',
    sector: '',
    fundingNeeds: '',
    growthStage: ''
  });

  /**
   * CHANGED: The handleChange function remains straightforward:
   * We update the relevant field in our profile object.
   */
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  /**
   * CHANGED: On form submit, post to /api/users/create and show an alert.
   */
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

  /**
   * CHANGED: Updated the styling to match the card-based approach,
   * with subtle boxShadow, borderRadius, and spacing.
   */
  return (
    <Card
      style={{
        maxWidth: 500,
        margin: '32px auto',
        padding: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: 8
      }}
    >
      <CardContent>
        <Typography variant="h5" align="center" style={{ fontWeight: 'bold', marginBottom: 16 }}>
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

          <Box style={{ textAlign: 'center', marginTop: 16 }}>
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
