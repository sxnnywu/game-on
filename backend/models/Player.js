const mongoose = require('mongoose');

// define schema
const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    pwhlSystemID: {
        type: Number,
        required: true,
        default: 0
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
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    statsFromThisWeek: {
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
        shots: {type: Number, default: 0}
        // we can add more stats as needed
    },
    stats: {
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
        shots: {type: Number, default: 0}
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