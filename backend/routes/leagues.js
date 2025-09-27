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
      week: 0,
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

// Get all leagues a user is in
router.get('/:id/leagues', async (req, res) => {

  const userId = req.params.id;
  try {
    // Check if user exists
    const user = await User.findById(userId).populate({
      path: 'leagues',
      populate: ['creatorId', 'teamIds'] // optional: populate teams and creator
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Return leagues
    res.status(200).json({ leagues: user.leagues });
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
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent user from joining the same league twice
    if (user.leagues.includes(league._id.toString()))
      return res.status(400).json({ message: 'User already in this league' });

    // Create a Team for the user
    const team = await Team.create({ ownerId: user._id, leagueId: league._id, roster: [], lineup: [] });
    league.teamIds.push(team._id);

    // Update user's leagues array
    user.leagues.push(league._id);

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

    // Check if user is in this league
    if (!user.leagues.includes(league._id.toString()))
      return res.status(400).json({ message: 'User is not in this league' });

    // Remove league from user's leagues array
    user.leagues = user.leagues.filter(id => id.toString() !== league._id.toString());

    await user.save();
    res.json({ message: 'Left league successfully' });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;


