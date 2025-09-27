const mongoose = require('mongoose');
const Matchup = require('../models/Matchup'); // adjust path if needed
require('dotenv').config(); // make sure MONGO_URI is in your .env

async function seedMatchups() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const matchups = [
      {
        leagueId: new mongoose.Types.ObjectId("68d759cfc8286889f4abe0af"),
        week: 1,
        teamAId: new mongoose.Types.ObjectId("68d75663c8286889f4abe096"),
        teamBId: new mongoose.Types.ObjectId("68d75663c8286889f4abe097"),
        scoreA: 10,
        scoreB: 12,
        status: "scheduled",
        createdAt: new Date()
      },
      {
        leagueId: new mongoose.Types.ObjectId("68d759cfc8286889f4abe0af"),
        week: 2,
        teamAId: new mongoose.Types.ObjectId("68d75663c8286889f4abe098"),
        teamBId: new mongoose.Types.ObjectId("68d75663c8286889f4abe099"),
        scoreA: 7,
        scoreB: 7,
        status: "scheduled",
        createdAt: new Date()
      }
    ];

    const inserted = await Matchup.insertMany(matchups);
    console.log('Inserted matchups:', inserted);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding matchups:', err);
  }
}

seedMatchups();
