import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Users, Trophy, Edit3, Save, Zap, TrendingUp, TrendingDown } from 'lucide-react';

const MyTeam = ({ userId, leagueId, teamId }) => {
  const [puckPosition, setPuckPosition] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [roster, setRoster] = useState([]);
  const [lineup, setLineup] = useState([]);
  const [bench, setBench] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(userId || null);

  useEffect(() => {
    if (!userId) {
      const token = localStorage.getItem('token');
      leagueId = localStorage.getItem('leagueID');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setCurrentUserId(decoded.id || decoded._id);
          userId = localStorage.getItem('userID');
        } catch (err) {
          console.error("Failed to decode JWT:", err);
        }
      }
    }
  }, [userId]);

  // Animated puck movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPuckPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Fetch team data from backend
  useEffect(() => {
    const fetchTeamID = async () => {
      try {

      } catch (err) {
        console.error("Error fetching team ID:", err);
        setError(err.message);
      }


    }
    const fetchTeamData = async () => {
      console.log("Starting fetch for teamId! userId:", userId, "leagueId:", leagueId);
      const response = await fetch(`https://game-on-9bhv.onrender.com/api/teams/getTeamID/${leagueId}/${userId}`);
      if (!response) throw new Error("pulling team id failed");
      const teamIDJson = await response.json();
      teamId = teamIDJson.id;
      console.log("fetch complete. teamId is: ", teamId);

      console.log("Starting fetch for team data teamId:", teamId, "leagueId:", leagueId);
      if (!teamId || !leagueId) {
        console.warn("Missing teamId or leagueId", { teamId, leagueId });
        setError("Missing team or league information");
        setLoading(false);   // stop loading spinner
        return;
      }


      console.log("Fetching team data:", `https://game-on-9bhv.onrender.com/api/teams/${teamId}`);
      setLoading(true);

      try {
        const res = await fetch(`https://game-on-9bhv.onrender.com/api/teams/${teamId}?leagueID=${encodeURIComponent(leagueId)}`, {
          headers: { "Accept": "application/json" },
        });

        console.log("Fetch response status:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("Backend returned error:", res.status, text);
          throw new Error(`Failed to fetch team: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Fetched team data:", data);

        const players = data.players || [];
        console.log("Parsed players:", players);

        setRoster(players);

        const lineupPlayers = players.filter(p => p.inLineup);
        const benchPlayers = players.filter(p => !p.inLineup);

        console.log("Lineup players:", lineupPlayers);
        console.log("Bench players:", benchPlayers);

        setLineup(lineupPlayers);
        setBench(benchPlayers);
        setError(null);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamID()
    fetchTeamData();
  }, [teamId, leagueId]);

  // Toggle edit mode and save lineup changes
  const toggleEditMode = async () => {
    if (editMode) {
      try {
        const lineupPlayerIds = lineup.map(p => p._id || p.id);
        console.log("Saving lineup with players:", lineupPlayerIds);

        const res = await fetch(`https://game-on-9bhv.onrender.com/api/teams/${teamId}/lineup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            leagueId,
            players: lineupPlayerIds,
          }),
        });

        console.log("Save response status:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("Save lineup failed:", res.status, text);
          throw new Error(`Failed to save lineup: ${res.status}`);
        }

        const data = await res.json();
        console.log("Lineup saved successfully:", data);
      } catch (err) {
        console.error("Error saving lineup:", err);
        setError("Failed to save lineup changes");
        return; // don't exit edit mode if save failed
      }
    }

    setEditMode(!editMode);
    setSelectedPlayer(null);
  };

  const movePlayerToLineup = (player) => {
    if (lineup.length >= 23) {
      setError('Lineup is full (23 players max)');
      return;
    }

    setLineup(prev => [...prev, player]);
    setBench(prev => prev.filter(p => (p._id || p.id) !== (player._id || player.id)));
    setSelectedPlayer(null);
  };


  const movePlayerToBench = (player) => {
    setBench(prev => [...prev, player]);
    setLineup(prev => prev.filter(p => (p._id || p.id) !== (player._id || player.id)));
    setSelectedPlayer(null);
  };

  const PlayerCard = ({ player, isInLineup = false }) => {
    const playerId = player._id || player.id;
    const isSelected = selectedPlayer && (selectedPlayer._id || selectedPlayer.id) === playerId;

    return (
      <div
        className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-300 transform hover:scale-105 hover:bg-white/20 cursor-pointer group relative overflow-hidden ${editMode ? 'hover:border-purple-400' : ''
          } ${isSelected ? 'ring-2 ring-purple-400' : ''}`}
        onClick={() => {
          if (editMode) {
            if (isSelected) {
              setSelectedPlayer(null);
            } else if (isInLineup) {
              movePlayerToBench(player);
            } else {
              movePlayerToLineup(player);
            }
          }
        }}
        onMouseEnter={() => setHoveredPlayer(player)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

        {/* Player info */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            {/* Player Avatar */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${player.position === 'G' ? 'from-orange-400 to-orange-600' :
                player.position === 'D' ? 'from-blue-400 to-blue-600' :
                  'from-green-400 to-green-600'
                } shadow-lg`}>
                {player.name ? player.name.split(' ').map(n => n[0]).join('') : 'NA'}
              </div>
              {/* Position badge */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm ${player.position === 'G' ? 'bg-orange-500' :
                player.position === 'D' ? 'bg-blue-500' :
                  'bg-green-500'
                }`}>
                {player.position || 'F'}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm mb-1 group-hover:text-purple-200 transition-colors truncate">
                {player.name || 'Unknown Player'}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-sm">{player.team || 'N/A'}</span>
                <div className="flex items-center space-x-1">
                  {player.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : player.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  ) : null}
                  {player.injury && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            {player.position === 'G' ? (
              <>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{player.wins || 0}</div>
                  <div className="text-purple-200">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{player.savePercentage ? (player.savePercentage * 100).toFixed(1) + '%' : '0%'}</div>
                  <div className="text-purple-200">SV%</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{player.losses || 0}</div>
                  <div className="text-purple-200">Losses</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{player.points || 0}</div>
                  <div className="text-purple-200">PTS</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{player.goals || 0}</div>
                  <div className="text-purple-200">G</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold text-lg">{player.assists || 0}</div>
                  <div className="text-purple-200">A</div>
                </div>
              </>
            )}
          </div>

          {player.nextGame && (
            <div className="mt-1 px-2 py-1 bg-white/10 rounded-lg">
              <div className="text-xs text-purple-300 text-center">
                Next: {player.nextGame}
              </div>
            </div>
          )}
        </div>

        {/* Edit mode overlay */}
        {editMode && (
          <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Edit3 className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    );
  };

  const totalPoints = lineup.reduce((sum, player) => {
    return sum + (player.points || player.wins || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading team data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-white opacity-10 transform rotate-12"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-white opacity-10 transform -rotate-12"></div>
        <div className="absolute top-20 left-20 w-8 h-8 bg-white rounded-full opacity-5 animate-bounce"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 bg-white rounded-full opacity-5 animate-ping"></div>
        <div
          className="absolute top-1/3 w-4 h-4 bg-white rounded-full opacity-20 transition-all duration-100"
          style={{ left: `${puckPosition}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo + Title + Dashboard link */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Zap className="w-10 h-10 text-white animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  PUCK<span className="text-purple-300"> YEAH!</span>
                </h1>
                <p className="text-purple-200 text-sm">My Team</p>
              </div>
            </div>

            {/* Dashboard link now sits beside PUCK YEAH! */}
            <div className="text-white font-bold text-xl">
              <a href="/dashboard" className="hover:text-purple-300 transition-colors">
                DASHBOARD
              </a>
            </div>
          </div>

          {/* Right: Edit button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleEditMode}
              disabled={loading}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${editMode
                  ? 'bg-green-600 text-white hover:bg-green-500'
                  : 'bg-purple-600 text-white hover:bg-purple-500'
                } disabled:opacity-50`}
            >
              {editMode ? (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Lineup</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Lineup</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200">
            {error}
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalPoints}</div>
            <div className="text-purple-200 text-sm">Total Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{lineup.length}</div>
            <div className="text-purple-200 text-sm">Lineup Players</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{bench.length}</div>
            <div className="text-purple-200 text-sm">Bench Players</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Lineup Section */}
          <div className="xl:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Users className="w-6 h-6 mr-3 text-green-400" />
                  Starting Lineup
                </h2>
                <span className="text-purple-200 text-sm">{lineup.length}/23 players</span>
              </div>

              {lineup.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-purple-200">No players in lineup</p>
                  <p className="text-purple-300 text-sm mt-2">
                    {editMode ? 'Click bench players to add them to your lineup' : 'Enable edit mode to manage your lineup'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lineup.map((player, index) => (
                    <div key={player._id || player.id || index}>
                      <PlayerCard player={player} isInLineup={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bench Section */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-purple-300" />
                Bench
              </h2>

              {bench.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-purple-200">No bench players</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bench.map((player, index) => (
                    <div key={player._id || player.id || index}>
                      <PlayerCard player={player} isInLineup={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Player Stats Panel */}
            {hoveredPlayer && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-4">Player Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Name:</span>
                    <span className="text-white font-semibold">{hoveredPlayer.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Team:</span>
                    <span className="text-white font-semibold">{hoveredPlayer.team || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Position:</span>
                    <span className="text-white font-semibold">{hoveredPlayer.position || 'N/A'}</span>
                  </div>
                  {hoveredPlayer.position === 'G' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Wins:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.wins || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Save %:</span>
                        <span className="text-white font-semibold">
                          {hoveredPlayer.savePercentage ? (hoveredPlayer.savePercentage * 100).toFixed(1) + '%' : '0%'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Points:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.points || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Goals:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.goals || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Assists:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.assists || 0}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Edit Mode Instructions */}
            {editMode && (
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-400/30 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-3">Edit Mode Active</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>• Click lineup players to move them to bench</p>
                  <p>• Click bench players to add them to lineup</p>
                  <p>• Maximum 12 players in lineup</p>
                  <p>• Click "Save Lineup" when done</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default MyTeam;