const express = require('express');
const router = express.Router();
import { db } from '../models/Player';
import '/models/Player.js'

//update scoring
router.post('/update', async (req, res) => {
    //get current date and date of a week ago
    const currentDate = Date.now.format(MM/DD/YYYY), oneWeekAgo = currentDate.addDays(-7).format(MM/DD/YYYY);

    //clear 'this week' player stats
    const players = Player.updateMany({status: true}, {statsFromThisWeek: null})

    //get pdub schedule

    //add player stats

    //get this week's matchups

    //add stats to score 

    //return
})