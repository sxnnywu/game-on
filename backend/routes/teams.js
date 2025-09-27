const express = require('express');
const router = express.Router();

// import models
const Team = require('../models/Team');

// get team roster
router.get('/:id', async (req, res) => {
    const { userId, leagueId } = req.query;

    console.log("Fetching team for user:", userId, "in league:", leagueId);

    if (!userId || !leagueId) {
        return res.status(400).json({ error: 'Missing userId or leagueId' });
    }

    try {
        const team = await Team.findOne({ _id: req.params.id, ownerId: userId, leagueId: leagueId });

        if(!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({ players: team.roster });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// update starting lineup
router.post('/:id/lineup', async (req, res) => {
    const { userId, leagueId, players } = req.body;

    if (!userId || !leagueId || !Array.isArray(players)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const team = await Team.findOneAndUpdate(
            { _id: req.params.id, ownerId: userId, leagueId: leagueId },
            { lineup: players },
            { new: true }
        );

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({ message: 'Players replaced successfully', team });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
