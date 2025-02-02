// src/components/ProfileForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ProfileForm = () => {
  // Initialize state for the profile
  const [profile, setProfile] = useState({
    name: '',
    company: '',
    sector: '',
    fundingNeeds: '',
    growthStage: ''
  });

  // Handle form field changes
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/create', profile);
      alert('Profile Created Successfully!');
      // Optionally reset the form:
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
    <div>
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={profile.company}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="sector"
          placeholder="Sector"
          value={profile.sector}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="fundingNeeds"
          placeholder="Funding Needs"
          value={profile.fundingNeeds}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="growthStage"
          placeholder="Growth Stage"
          value={profile.growthStage}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
