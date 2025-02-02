// backend/models/fundingModel.js
const mongoose = require('mongoose');

const fundingSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    sector: String,
    eligibilityCriteria: String,
    deadline: Date,
});

module.exports = mongoose.model('Funding', fundingSchema);