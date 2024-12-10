const mongoose = require('mongoose');

// Define the Dark Sky Reserve schema
const darkSkyReserveSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

// Create a compound index on name and location
darkSkyReserveSchema.index({ name: 1, location: 1 });

// Export a function that takes the database connection and returns the model
module.exports = (darkSkyDB) => {
    return darkSkyDB.model('DarkSkyReserve', darkSkyReserveSchema);
};
 