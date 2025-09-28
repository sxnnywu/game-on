const express = require('express');
const router = express.Router();

// import models
const Team = require('../models/Team');
const League = require('../models/League');

// get team roster
router.get('/:id', async (req, res) => {
  const teamId = req.params.id;
  const leagueId = req.query.leagueID;
  const userId = req.query.userID; // optional if you want to verify ownership

  if (!teamId || !leagueId) {
    return res.status(400).json({ error: 'Missing teamId or leagueId' });
  }

  try {
    const team = await Team.findOne({ _id: teamId, leagueId });

    if (!team) {
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
        console.log("Updating lineup for user:", userId, "in league:", leagueId, "with players:", players);
        const team = await Team.findOneAndUpdate(
            { _id: req.params.id, ownerId: userId, leagueId: leagueId },
            { lineup: players },
            { new: true }
        );
        console.log("Updated team:", team);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json({ message: 'Players replaced successfully', team });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// view all teams in a league
router.get('/:id/teams', async (req, res) => {
    const leagueId = req.params.id;

    // if no leagueId provided
    if (!leagueId) 
        return res.status(400).json({ error: 'Missing league ID' });

    try {
        // Verify league exists
        const league = await League.findById(leagueId);
        if (!league) 
            return res.status(404).json({ error: 'League not found' });
        
        // Get all teams in this league and populate owner info
        const teams = await Team.find({ leagueId })
            .populate('ownerId', 'username email')
            .populate('roster')
            .populate('lineup');

        // return teams
        res.status(200).json({
            leagueId,
            leagueName: league.name,
            teams
        });
    } 
    catch (err) {
        console.error('Error fetching teams:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
