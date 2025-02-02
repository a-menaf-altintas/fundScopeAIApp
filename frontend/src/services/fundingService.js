// src/services/fundingService.js
import axios from 'axios';

export const getFundingRecommendation = (userProfile) => {
  return axios.post('/api/llama/recommend', { userProfile });
};
