const mongoose = require('mongoose');
require('dotenv').config();
const Player = require('./models/Player'); // adjust path if needed

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

async function seedPlayers() {
  try {
    const players = [
      { name: 'Alice Johnson', team: 'Team A', position: 'Forward' },
      { name: 'Bob Smith', team: 'Team B', position: 'Goalkeeper' },
      { name: 'Charlie Lee', team: 'Team C', position: 'Midfielder' },
      { name: 'Dana White', team: 'Team A', position: 'Defender' }
    ];

    const inserted = await Player.insertMany(players);
    console.log('Inserted players:', inserted);

    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding players:', err);
  }
}

seedPlayers();
