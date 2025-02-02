// backend/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    company: String,
    sector: String,
    fundingNeeds: String,
    growthStage: String,
});

module.exports = mongoose.model('User', userSchema);