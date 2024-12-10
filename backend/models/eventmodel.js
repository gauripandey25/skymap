const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true }
}, { collection: 'skyevents' }); // Specify the collection name here

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
