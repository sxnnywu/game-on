// server.js or index.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Player = require('./models/Player');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

// API route to get all players
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Optional: API route to seed players
app.post('/api/seed-players', async (req, res) => {
  try {
    const players = [
      { name: 'Alice Johnson', team: 'Team A', position: 'Forward' },
      { name: 'Bob Smith', team: 'Team B', position: 'Goalkeeper' },
      { name: 'Charlie Lee', team: 'Team C', position: 'Midfielder' },
      { name: 'Dana White', team: 'Team A', position: 'Defender' }
    ];

    const inserted = await Player.insertMany(players);
    res.json(inserted);
  } catch (err) {
    res.status(500).json({ error: 'Error seeding players' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
