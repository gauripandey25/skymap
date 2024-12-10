const mongoose = require('mongoose');

// Define the schema for the explore collection
const exploreSchema = new mongoose.Schema({
    _id: String,
    type: { type: String, required: true }, // e.g., 'constellation', 'planet', 'star'
    name: { type: String, required: true },
    description: { type: String, required: true },// URL or path to the image
}, { collection: 'explore' }); // Specify the collection name

// Create the model based on the schema
const Explore = mongoose.model('Explore', exploreSchema);

module.exports = Explore;
