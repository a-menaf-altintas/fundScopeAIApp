// src/components/Dashboard.js
import React, { useState } from 'react';
import axios from 'axios';

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
      // Send the user profile description to the backend
      const response = await axios.post('/api/llama/recommend', { userProfile });
      // Check if the response contains a recommendation
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
    <div>
      <h2>Funding Recommendations</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="userProfile"
          value={userProfile}
          onChange={(e) => setUserProfile(e.target.value)}
          placeholder="Describe your company and funding needs"
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </form>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {recommendation && (
        <div>
          <h3>Recommendation:</h3>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
