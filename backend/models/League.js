const mongoose = require('mongoose');

// define schema
const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        }
    ],
    draftStatus: {
        type: String,
        enum: ['not_started', 'in_progress', 'finished'],
        default: 'not_started'
    },
    currentTurn: {
        currentPick: {type: mongoose.Schema.Types.ObjectId, refPath: 'currentTurnModel'}, // could be User or Team
        round: {type: Number}
    },
    currentTurnModel: {
        type: String,
        enum: ['User', 'Team']
    },
    week: {
        type: Number,
        default: 1
    },
    playerPool: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
    draftedPlayers: [
        {
            playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
            teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
            pickOrder: Number
        }
    ],
    schedule: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Matchup'
        }
    ],
    standings: [
        {
            teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
            wins: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            ties: { type: Number, default: 0 },
            points: { type: Number, default: 0 }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// export the model
module.exports = mongoose.model('League', leagueSchema);