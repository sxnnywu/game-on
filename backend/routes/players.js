const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET /api/players
// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
