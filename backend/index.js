// import express
const express = require('express');

// connect to mongoDB

// use middleware
const app = express();
app.use(express.json());

// ROUTES

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});