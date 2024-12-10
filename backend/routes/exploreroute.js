const express = require('express');
const Explore = require('../models/exploremodel');

const createExploreRoutes = () => {
    const router = express.Router();

    // Route to get all explore items
    router.get('/', async (req, res) => {
        try {
            const items = await Explore.find({});
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Route to get only constellations
    router.get('/constellations', async (req, res) => {
        try {
            const constellations = await Explore.find({ type: 'constellation' });
            res.json(constellations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Route to get only planets
    router.get('/planets', async (req, res) => {
        try {
            const planets = await Explore.find({ type: 'planet' });
            res.json(planets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // Route to get only stars
    router.get('/stars', async (req, res) => {
        try {
            const stars = await Explore.find({ type: 'star' });
            res.json(stars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    return router;
};

module.exports = createExploreRoutes;
