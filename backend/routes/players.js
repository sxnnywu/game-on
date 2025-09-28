const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find({status: true});
    res.json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/load', async (req, res) => {
  try {
    await Player.updateMany({status: true}, {status: false})
    const teamsRes = await fetch('https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=teamsbyseason&season_id=5&key=446521baf8c38984&client_code=pwhl');

    if (!teamsRes.ok) {
      return res.status(400).json({ error: 'Issue obtaining teams' });
    }

    const teams = await teamsRes.json();

    console.log("teams: ", teams)
    
    //for each team
    teams.Teamsbyseason.forEach(async team => {
      const rosterRes = await fetch(`https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=roster&team_id=${team.team_id}&season_id=7&key=446521baf8c38984&client_code=pwhl`);
      
      if (!rosterRes.ok) {
        return res.status(400).json({ error: 'Issue obtaining teams' });
      }

      const roster = await rosterRes.json();

      console.log("roster: ", roster)

      roster.Roster.forEach(async playerProfile => {
        const playerStatsRes = await fetch(`https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=player&category=mostrecentseasonstats&player_id=${playerProfile.player_id}&key=446521baf8c38984&client_code=pwhl`);

        if (!playerStatsRes.ok) {
          return res.status(400).json({ error: 'Issue obtaining teams' });
        }

        const playerStats = await playerStatsRes.json();

        console.log("player: ", player)

        player = Player.findOne({pwhlSystemID: playerProfile.player_id});
        let isGoalie = false;
        if(playerProfile.position === "G") {
          isGoalie = true;
        }

        if(!player && playerProfile.rookie) {
          //insert rookie
          Player.insertOne({
            name: playerProfile.name,
            pwhlSystemID: playerProfile.player_id,
            team: team.code,
            position: playerProfile.position,
            status: true,
            statsFromThisWeek: {goals: 0, assists: 0, saves: 0, shots: 0},
            stats: {goals: 0, assists: 0, saves: 0, shots: 0},
            lastSeasonStats: {rookie: true, goals: 0, assists: 0, saves: 0, shots: 0},
            draftStatus: null
          });
        } else if (!player && !playerProfile.rookie) {
          //update returning player
          Player.insertOne({
            name: playerProfile.name,
            pwhlSystemID: playerProfile.player_id,
            team: team.code,
            position: playerProfile.position,
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

    return res.status(200).json({message: "woo! done!"});

  } catch {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
