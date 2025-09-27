const express = require('express');
const router = express.Router();

// models
const League = require('../models/League');
const User = require('../models/User');
const Team = require('../models/Team');
const Player = require('../models/Player');

// Get draft state
router.get('/:id/draft', async (req, res) => {
    const leagueId = req.params.id;

    // if no leagueId provided
    if (!leagueId)
        return res.status(400).json({ error: 'Missing league ID' });

    try {
        // find league and populate necessary fields
        const league = await League.findById(leagueId)
            .populate('currentTurn')
            .populate('draftedPlayers.playerId')
            .populate('draftedPlayers.teamId')
            .populate('playerPool');

        // if league not found
        if (!league)
            return res.status(404).json({ error: 'League not found' });

        // return draft state
        res.status(200).json({
            draftStatus: league.draftStatus,
            currentTurn: league.currentTurn,
            round: league.round,
            draftedPlayers: league.draftedPlayers.map(dp => ({
                player: dp.playerId,
                team: dp.teamId,
                pickOrder: dp.pickOrder
            })),
            remainingPlayerPool: league.playerPool,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// make a draft pick
router.post('/:id/draft/pick', async (req, res) => {
    const leagueId = req.params.id;
    const { teamId, playerId } = req.body;

    // if missing params
    if (!leagueId || !teamId || !playerId)
        return res.status(400).json({ error: 'Missing leagueId, teamId, or playerId' });

    try {

        // find league
        const league = await League.findById(leagueId).populate('teamIds');
        if (!league) return res.status(404).json({ error: 'League not found' });

        // if draft not in progress
        if (league.draftStatus !== 'in_progress')
            return res.status(400).json({ error: 'Draft is not in progress' });

        // check if it's this team's turn
        if (league.currentTurn.toString() !== teamId)
            return res.status(400).json({ error: 'Not this team’s turn' });

        // check if player is in pool
        if (!league.playerPool.some(id => id.toString() === playerId))
            return res.status(400).json({ error: 'Player not available' });

        // add player to draftedPlayers
        league.draftedPlayers.push({
            playerId,
            teamId,
            pickOrder: league.draftedPlayers.length + 1
        });

        // remove player from pool
        league.playerPool = league.playerPool.filter(id => id.toString() !== playerId);

        // update player's draft status
        await Player.findByIdAndUpdate(playerId, { draftStatus: 'drafted' });

        // advance turn
        const teamIds = league.teamIds.map(t => t._id.toString());
        let currentIndex = teamIds.indexOf(teamId);
        currentIndex = (currentIndex + 1) % teamIds.length;
        league.currentTurn = teamIds[currentIndex];

        // if we completed a full round, increment round
        if (currentIndex === 0)
            league.round += 1;
        await league.save();

        // respond with updated draft state
        res.status(200).json({
            message: 'Player drafted successfully',
            draftedPlayer: playerId,
            nextTurn: league.currentTurn,
            round: league.round,
            remainingPlayerPool: league.playerPool.length
        });
    }
    catch (err) {
        console.error('Error making draft pick:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// finalize draft and generate rosters
router.post('/:id/draft/finish', async (req, res) => {
    const leagueId = req.params.id;

    // if no leagueId provided
    if (!leagueId) return res.status(400).json({ error: 'Missing league ID' });

    try {
        // Find league
        const league = await League.findById(leagueId).populate('draftedPlayers.playerId');
        if (!league) return res.status(404).json({ error: 'League not found' });

        // Check if draft is in progress
        if (league.draftStatus !== 'in_progress')
            return res.status(400).json({ error: 'Draft is not in progress' });

        // For each drafted player, assign them to their team's roster
        for (const dp of league.draftedPlayers) {
            const team = await Team.findById(dp.teamId);

            // If team not found, skip
            if (!team) continue;

            // Add player to roster if not already present
            if (!team.roster.includes(dp.playerId._id)) {
                team.roster.push(dp.playerId._id);

                // Add to lineup
                team.lineup.push(dp.playerId._id);
                await team.save();
            }
        }

        // Mark draft as finished
        league.draftStatus = 'finished';
        await league.save();

        // Respond with success
        res.status(200).json({
            message: 'Draft finalized successfully',
            leagueId: league._id,
            totalDraftedPlayers: league.draftedPlayers.length
        });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;