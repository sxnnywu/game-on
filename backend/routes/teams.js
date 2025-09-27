const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const {userID, leagueID} = req.query;

    if (!userID || !leagueID) {
        return res.status(400).json({ error: 'Missing userID or leagueID' });
    }

    try {
        const team = await Team.findOne({userID, leagueID});

        if(!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({players: team.players});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.post('/:id/lineup', async (req, res) => {
    const { userID, leagueID, players} = req.body

    if (!userID || !leagueID || !Array.isArray(players)) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const team = await Team.findOneAndUpdate(
            { userId, leagueId },
            { players: players },
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


})