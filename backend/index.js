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

// mount routes
app.use('/api/auth', authRoutes);
app.use('/api/leagues', leagueRoutes);

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});