const express = require('express');
const router = express.Router();
const Matchup = require('../models/Matchup');

// Get matchup by ID
router.get('/:id', async (req, res) => {
    console.log("Received request for matchup ID");
    const matchID = req.params.id;
    console.log("Fetching matchup with ID:", matchID);
    if (!matchID) {
        console.log("No matchID provided in request");
        return res.status(400).json({ error: 'Missing matchID' });
    }

    try {
        const matchup = await Matchup.findById(req.params.id);
        console.log("Matchup found:", matchup);
        if (!matchup) {
            console.log("No matchup found with the provided ID");
            return res.status(404).json({ error: 'Matchup not found' });
        }

        res.status(200).json({
            leagueId: matchup.leagueId,
            week: matchup.week,
            teamAId: matchup.teamAId,
            teamBId: matchup.teamBId,
            scoreA: matchup.scoreA,
            scoreB: matchup.scoreB,
            status: matchup.status,
            createdAt: matchup.createdAt
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get scores
router.get('/:id/score', async (req, res) => {
    const matchID = req.params.id;

    if (!matchID) {
        return res.status(400).json({ error: 'Missing matchID' });
    }

    try {
        const matchup = await Matchup.findById(matchID);

        if (!matchup) {
            return res.status(404).json({ error: 'Matchup not found' });
        }

        let winner = 0;
        if (matchup.scoreA > matchup.scoreB) winner = matchup.teamAId;
        else if (matchup.scoreB > matchup.scoreA) winner = matchup.teamBId;

        res.status(200).json({
            leagueId: matchup.leagueId,
            scoreA: matchup.scoreA,
            scoreB: matchup.scoreB,
            winner
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// get all matchups for a league
// Get all matchups for a league
router.get('/league/:leagueId', async (req, res) => {
  try {
    const { leagueId } = req.params;

    const matchups = await Matchup.find({ leagueId })
      .populate('teamAId')
      .populate('teamBId');

    res.status(200).json({ matchups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;