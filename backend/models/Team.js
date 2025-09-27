const mongoose = require('mongoose');

// define schema
const teamSchema = new mongoose.Schema({
    _id: {
        type: Integer,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true
    },
    roster: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
    lineup: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// export the model
module.exports = mongoose.model('Team', teamSchema);