const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } 
  catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;