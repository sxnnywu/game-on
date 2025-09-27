const express = require('express');
const router = express.Router();
import '/models/Matchup.js'

router.get('/:id', async (req, res) => {
    const matchID = req.params.id;

    if(!matchID) {
        return res.status(400).json({ error: 'Missing matchID' });
    }

    try {
        const matchup = Matchup.findOne({matchID});

        if(!matchup) {
            return res.status(404).json({ error: 'Matchup not found' });
        }

        res.status(200).json({leagueId: matchup.leagueId}, 
            {week: matchup.week}, 
            {teamAId: matchup.teamAId}, 
            {teamBId: matchup.teamBId},
            {scoreA: matchup.scoreA},
            {scoreB: matchup.scoreB},
            {status: matchup.status},
            {createdAt: matchup.createdAt}
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/:id/score', async (req, res) => {
    const matchID = req.params.id;

    if(!matchID) {
        return res.status(404).json({ error: 'Matchup not found' });
    }

    try {
        const matchup = Matchup.findOne({matchID});

        if(!matchup) {
            return res.status(404).json({ error: 'Matchup not found' });
        }

        if(matchup.scoreA > matchup.scoreB) {
            res.status(200).json({leagueId: matchup.leagueId}, 
                {scoreA: matchup.scoreA},
                {scoreB: matchup.scoreB},
                {winner: matchup.teamAId}
            );
        } else if (matchup.scoreA < matchup.scoreB) {
            res.status(200).json({leagueId: matchup.leagueId}, 
                {scoreA: matchup.scoreA},
                {scoreB: matchup.scoreB},
                {winner: matchup.teamBId}
            );
        }
        
        res.status(200).json({leagueId: matchup.leagueId}, 
            {scoreA: matchup.scoreA},
            {scoreB: matchup.scoreB},
            {winner: 0}
        );
    } catch {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

})