const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET /api/players
// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find({status: true});
    res.json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/initialLoad', async (req, res) => {
  try {
    await Player.updateMany({status: true}, {status: false})
    const teams = await fetch('https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=teamsbyseason&season_id=5&key=446521baf8c38984&client_code=pwhl')
    
    if (!teams.ok) {
      return res.status(400).json({ error: 'Issue obtaining teams' });
    }
    
    //for each team
    teams.Teamsbyseason.forEach(async team => {
      const roster = await fetch(`https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=roster&team_id=${team.team_id}&season_id=7&key=446521baf8c38984&client_code=pwhl`);
      
      roster.Roster.forEach(async playerProfile => {
        const playerStats = await fetch(`https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=player&category=mostrecentseasonstats&player_id=${playerProfile.player_id}&key=446521baf8c38984&client_code=pwhl`);

        player = Player.findOne({pwhlSystemID: playerProfile.player_id});
        let isGoalie = false;
        if(playerProfile.position === "G") {
          isGoalie = true;
        }

        if(!player && playerProfile.rookie) {
          //insert rookie
          Player.insertOne({
            team: team.code,
            status: true,
            statsFromThisWeek: {goals: 0, assists: 0, saves: 0, shots: 0},
            stats: {goals: 0, assists: 0, saves: 0, shots: 0},
            lastSeasonStats: {rookie: true, goals: 0, assists: 0, saves: 0, shots: 0},
            draftStatus: null
          });
        } else if (!player && !playerProfile.rookie) {
          //update returning player
          Player.insertOne({
            team: team.code,
            status: true,
            statsFromThisWeek: {goals: 0, assists: 0, saves: 0, shots: 0},
            stats: {goals: 0, assists: 0, saves: 0, shots: 0},
            lastSeasonStats: {
              rookie: false, 
              goals: playerStats.Player.goals, 
              assists: playerStats.Player.assists, 
              saves: isGoalie ? playerStats.Player.saves : 0, 
              shots: playerStats.Player.shots
            },
            draftStatus: null
          });
        }else {
          //update returning player
          Player.updateOne(
            {pwhlSystemID:playerProfile.player_id},
            {$set: {
              team: team.code,
              status: true,
              statsFromThisWeek: {goals: 0, assists: 0, saves: 0, shots: 0},
              stats: {goals: 0, assists: 0, saves: 0, shots: 0},
              lastSeasonStats: {
                rookie: false, 
                goals: playerStats.Player.goals, 
                assists: playerStats.Player.assists, 
                saves: isGoalie ? playerStats.Player.saves : 0, 
                shots: playerStats.Player.shots
              },
              draftStatus: null
            }}
          );
        }

        await player.save()

      });
    });

  } catch {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
