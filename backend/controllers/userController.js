// backend/controllers/userController.js
const User = require('../models/userModel');

exports.createUserProfile = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Error creating user profile' });
    }
};