// backend/routes/fundingRoutes.js
const express = require('express');
const { getFundingRecommendations } = require('../controllers/fundingController');

const router = express.Router();

// Route to get funding recommendations
router.post('/recommend', getFundingRecommendations);

module.exports = router;