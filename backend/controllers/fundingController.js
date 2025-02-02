// backend/controllers/fundingController.js
const Funding = require('../models/fundingModel');

exports.getFundingRecommendations = async (req, res) => {
    try {
        const { sector, fundingNeeds } = req.body;
        
        // This is a placeholder for AI model integration or database queries.
        const fundingOpportunities = await Funding.find({
            sector,
            amount: { $lte: parseInt(fundingNeeds) },
        });

        res.json(fundingOpportunities);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching funding opportunities' });
    }
};