const express = require('express');
const router = express.Router();

// models
const League = require('../models/League');
const User = require('../models/User');
const Team = require('../models/Team');

// Create a new league
router.post('/', async (req, res) => {
  try {
    const { name, creatorId } = req.body;

    // Validate name and creatorId
    if (!name || !creatorId) {
      return res.status(400).json({ message: 'Name and creatorId are required' });
    }

    // Create league
    const newLeague = await League.create({
      name,
      creatorId,
      teamIds: [],
      draftStatus: 'not_started',
      currentTurn: null,
      round: 0,
      playerPool: [],
      draftedPlayers: [],
      schedule: [],
      standings: [],
      createdAt: new Date()
    });
    res.status(201).json(newLeague);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get league details
router.get('/:id', async (req, res) => {
  try {

    // Find league by ID
    const league = await League.findById(req.params.id)
      .populate('teamIds')   // optional: populate teams
      .populate('creatorId'); // optional: populate creator user

    // If league not found
    if (!league) return res.status(404).json({ message: 'League not found' });

    // Return league details
    res.json(league);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a league
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if league exists
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    // Check if user exists
    console.log("Looking for user:", userId);
    const user = await User.findById(userId);
    console.log("Found user:", user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Limit user to one league
    if (user.league) 
      return res.status(400).json({ message: 'User can only join one league' });
    
    // Create a Team for the user
    const team = await Team.create({ ownerId: user._id, leagueId: league._id, roster: [], lineup: [] });
    league.teamIds.push(team._id);

    // Update user's league reference
    user.league = league._id;
    await user.save();
    await league.save();
    res.json({ message: 'Joined league successfully' });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a league
router.post('/:id/leave', async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if league exists
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user is actually in this league
    if (!user.league || user.league.toString() !== league._id.toString())
      return res.status(400).json({ message: 'User is not in this league' });

    // Remove user from league
    user.league = null;
    await user.save();
    res.json({ message: 'Left league successfully' });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

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

module.exports = router;


