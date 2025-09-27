const mongoose = require('mongoose');

// define schema
const matchupSchema = new mongoose.Schema({
    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true
    },
    week: {
        type: Number,
        required: true
    },
    teamAId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    teamBId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    scoreA: {
        type: Number,
        default: 0
    },
    scoreB: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'finished'],
        default: 'upcoming'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// export the model
module.exports = mongoose.model('Matchup', matchupSchema);