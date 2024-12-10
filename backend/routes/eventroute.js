const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Event = require('../models/eventmodel');

router.get('/', verifyToken, async (req, res) => {
    try {
        const events = await Event.find().sort({ _id: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
