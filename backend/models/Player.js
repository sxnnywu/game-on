const mongoose = require('mongoose');

// define schema
const playerSchema = new mongoose.Schema({
    _id: {
        type: Integer,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    team: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    stats: {
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
        // we can add more stats as needed
    },
    draftStatus: {
        type: String,
        enum: ['available', 'drafted'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// export the model
module.exports = mongoose.model('Player', playerSchema);