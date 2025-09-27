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

router.get('/:id/schedule', async (req, res) => {
  const leagueID = req.params.id
  try {
    const league = League.findById(leagueID);
    
    //if league not found
    if (!league) return res.status(404).json({message: 'League not found' });
    
    res.status(200).json({message: 'Found league schedule', schedule : league.schedule});


  } catch {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id/score', async (req, res) => {
  const leagueID = req.params.id
  try {
    const league = League.findById(leagueID);
    
    //if league not found
    if (!league) return res.status(404).json({message: 'League not found' });
    
    res.status(200).json({message: 'Found league standings', standings : league.standings});

  } catch {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;


