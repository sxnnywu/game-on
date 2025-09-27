const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
require('dotenv').config();

// enable cors for all routes and origins
app.use(cors());

// connect to mongoDB
const connectDB = require('./config/db');
connectDB();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Server is alive!');
});

// import routes
const authRoutes = require('./routes/auth');
const leagueRoutes = require('./routes/leagues');
const draftingRoutes = require('./routes/drafting');
const teamRoutes = require('./routes/teams');
const matchupsRoutes = require('./routes/matchups');
const playersRoutes = require('./routes/players');

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/drafting', draftingRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matchups', matchupsRoutes);
app.use('/api/players', playersRoutes);

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});