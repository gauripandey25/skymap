const express = require('express');
const router = express.Router();
const axios = require('axios'); // For making HTTP requests
const { verifyToken } = require('../middleware/auth');
const createDarkSkyModel = require('../models/darkskymodel');

const OPENCAGE_API_KEY = 'a7a8d32625674d8f98f7fdcb073559e6'; // Your OpenCage API key

module.exports = (darkSkyDB) => {
    const DarkSkyReserve = createDarkSkyModel(darkSkyDB);

    router.get('/search', verifyToken, async (req, res) => {
        const location = req.query.location ? req.query.location.trim() : '';

        if (!location) {
            return res.status(400).json({ message: 'Location query parameter is required.' });
        }

        console.log('Search location:', location);

        try {
            // Geocoding to convert location name to coordinates
            const geocodeResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
                params: {
                    q: location,
                    key: OPENCAGE_API_KEY
                }
            });

            const results = geocodeResponse.data.results;
            if (results.length === 0) {
                return res.status(404).json({ message: 'Location not found.' });
            }

            const { lat, lng } = results[0].geometry;

            // Find reserves near the coordinates
            let reserves = await DarkSkyReserve.find({
                location: { $regex: new RegExp(location, 'i') }
            });

            if (reserves.length === 0) {
                console.log('No matches found. Suggesting broader search...');
                // No specific matches found
                res.json({
                    message: 'No dark sky reserves found for this location. Please try searching by a broader location, such as by country or region.'
                });
                return;
            }

            // Send response with found reserves
            console.log('Found reserves:', reserves);
            res.json(reserves);
        } catch (err) {
            console.error('Error fetching reserves:', err);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    return router;
};
