const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const createDarkSkyRoutes = require('./routes/darkskyroute');
const createExploreRoutes = require('./routes/exploreroute');
const eventRoutes = require('./routes/eventroute');
const { verifyToken } = require('./middleware/auth');
require('dotenv').config();

const app = express();
const dbURI = process.env.MONGO_URI;
const darkSkyDBURI = process.env.DARKSKY_MONGO_URI;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

mongoose.connect(dbURI)
    .then(() => console.log('Main MongoDB connected'))
    .catch(err => console.error('Main MongoDB connection error:', err));

const darkSkyDB = mongoose.createConnection(darkSkyDBURI);
darkSkyDB.on('error', err => console.error('Dark Sky Reserves MongoDB connection error:', err));
darkSkyDB.once('open', () => console.log('Dark Sky Reserves MongoDB connected'));

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use('/api/events', verifyToken, eventRoutes);
app.use('/darkskyroute', verifyToken, createDarkSkyRoutes(darkSkyDB));
app.use('/explore', verifyToken, createExploreRoutes());

// Serve the static file
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'login.html'));
});

// Catch-all route for invalid endpoints
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Cache Control middleware
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
});
app.use(cors({
    origin: 'https://skymapwebsite.netlify.app',  // Update to your Netlify frontend URL
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

