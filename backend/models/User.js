const mongoose = require('mongoose');

// define schema
const userSchema = new mongoose.Schema({
    _id: {
        type: Integer,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// export the model
module.exports = mongoose.model('User', userSchema);