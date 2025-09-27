const express = require('express');
const router = express.Router();

// models
const League = require('../models/League');
const Team = require('../models/Team');
const Matchup = require('../models/Matchup');

//update scoring
router.post('/update', async (req, res) => {
    try {
        //get current date and date of a week ago
        const currentDate = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);

        //clear 'this week' player stats
        await Player.updateMany({status: true}, {statsFromThisWeek: null})

        //get pdub schedule
        const url = 'https://lscluster.hockeytech.com/feed/?feed=modulekit&view=schedule&season_id=5&key=446521baf8c38984&client_code=pwhl';
            //SEASON ID VARIABLE
        const scheduleCall = await fetch(url);

        if (!scheduleCall.ok) {
            return res.status(400).json({ error: 'Issue obtaining PWHL schedule' });
        }

        const scheduleData = await scheduleCall.json();

        if (!scheduleData?.SiteKit?.Schedule) {
            return res.status(400).json({ error: 'Issue with the schedule JSON' });
        }

        const filteredSchedule = scheduleCall.SiteKit.Schedule.filter(item => {
            if(!item?.date) return false;
            const itemDate = new Date(item.date);
            return itemDate >= oneWeekAgo && itemDate <= currentDate;
        });

        //fetch games in parallel
        const gameDataList = await Promise.all(
            filteredSchedule.map(async game => {
                try {
                    const gameUrl = `https://lscluster.hockeytech.com/feed/index.php?feed=gc&tab=gamesummary&game_id=${game.game_id}&key=446521baf8c38984&client_code=pwhl`;
                    const gameRes = await fetch(gameUrl);
                    if (!gameRes.ok) return res.status(400).json({ error: `Game API failed for ${game.game_id}: ${gameRes.status}` });
                    return await gameRes.json();
                } catch (err) {
                    console.error(`Failed to fetch game ${game.game_id}:`, err.message);
                    return null; // Skip bad games but continue processing others
                }
            })
        );
        
        //collect player update promises
        const playerUpdatePromises = [];

        for(const gameData of gameDataList) {
            if (!gameData?.Gamesummary) continue;
            const { home_team_lineup, visitor_team_lineup } = gameData.Gamesummary;

            const updatePlayerStats = (player, isGoalie = false) => {
                Player.updateOne(
                    {pwhlSystemID: player.player_id }, // Filter to select the document
                    {$set: {
                        statsFromThisWeek: {goals: player.goals, assists: player.assists, saves: isGoalie ? player.saves : 0, shots: player.shots},
                    }, $inc: {
                        stats: {goals: player.goals, assists: player.assists, saves: isGoalie ? player.saves : 0, shots: player.shots}
                    }} // Update operation
                ).catch(err => console.error(`Failed to update player ${player.player_id}:`, err.message));
            }

            //queueing updates
            home_team_lineup.players.forEach(player => playerUpdatePromises.push(updatePlayerStats(player)));
            visitor_team_lineup.players.forEach(player => playerUpdatePromises.push(updatePlayerStats(player)));
            home_team_lineup.goalies.forEach(goalie => playerUpdatePromises.push(updatePlayerStats(goalie, true)));
            visitor_team_lineup.goalies.forEach(goalie => playerUpdatePromises.push(updatePlayerStats(goalie, true)));
        }
        
        await Promise.all(playerUpdatePromises)

        //get this week's matchups
        let leagues = await League.updateMany({$inc: {week : 1}})
        let week = League.findOne().week;
        const matchups = Matchup.find({week: week}); //VARIABLE WEEK

        //calculate scores in parallel
        await Promise.all(
            matchups.map(async match => {
                const [teamA, teamB] = await Promise.all([
                    Team.findById(match.teamAId), 
                    Team.findById(match.teamBId)
                ]);

                let scoreA = 0, scoreB = 0;

                teamA.lineup.forEach(p => {
                    scoreA += (p.statsFromThisWeek?.goals || 0) * 3;
                    scoreA += (p.statsFromThisWeek?.assists || 0) * 2;
                    scoreA += p.statsFromThisWeek?.shots || 0;
                    scoreA += p.statsFromThisWeek?.saves || 0;
                });

                teamB.lineup.forEach(p => {
                    scoreB += (p.statsFromThisWeek?.goals || 0) * 3;
                    scoreB += (p.statsFromThisWeek?.assists || 0) * 2;
                    scoreB += p.statsFromThisWeek?.shots || 0;
                    scoreB += p.statsFromThisWeek?.saves || 0;
                });

                await match.updateOne({ _id: match._id }, { $set: {scoreA: scoreA, scoreB: scoreB, status: 'finished'}});

                const league = League.findOne({_id: teamA.leagueID});
                
                if (!league) return res.status(400).json({ error: `Could not find league for team ${teamAID}` });

                if(scoreA > scoreB) {
                    let teamStandingsUpdate = league.standings.findOne({teamId: teamAId});
                    teamStandingsUpdate.wins++;
                    teamStandingsUpdate.points += 2;

                    teamStandingsUpdate = league.standings.findOne({teamId: teamBId});
                    teamStandingsUpdate.losses++;
                } else if (scoreA < scoreB) {
                    let teamStandingsUpdate = league.standings.findOne({teamId: teamBId});
                    teamStandingsUpdate.wins++;
                    teamStandingsUpdate.points += 2;

                    teamStandingsUpdate = league.standings.findOne({teamId: teamAId});
                    teamStandingsUpdate.losses++;
                } else {
                    let teamStandingsUpdate = league.standings.findOne({teamId: teamAId});
                    teamStandingsUpdate.ties++;
                    teamStandingsUpdate.points++;

                    teamStandingsUpdate = league.standings.findOne({teamId: teamAId});
                    teamStandingsUpdate.ties++;
                    teamStandingsUpdate.points++;
                }

                await league.save();

            })
        );

        leagues.forEach(async league => {
            league.standings.sort((a, b) => b.points - a.points);

            await league.save();
        })

        //return
        res.status(200).json({message: 'Scores updates successfully', matchups});
    } catch {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
    
})
