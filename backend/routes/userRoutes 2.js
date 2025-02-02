// backend/routes/userRoutes.js
const express = require('express');
const { createUserProfile } = require('../controllers/userController');

const router = express.Router();

router.post('/create', createUserProfile);

module.exports = router;