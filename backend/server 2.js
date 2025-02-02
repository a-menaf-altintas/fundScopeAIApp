// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const fundingRoutes = require('./routes/fundingRoutes');
const { getFundingRecommendations } = require('./pythonShell');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log('DB Connection Error: ', err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/funding', fundingRoutes);
app.post('/api/llama/recommend', getFundingRecommendations);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
