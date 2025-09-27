import React, { useState, useEffect } from 'react';
import { Users, Trophy, Star, Edit3, Save, X, Zap, Settings, LogOut, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MyTeam = () => {
  const [puckPosition, setPuckPosition] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [lineup, setLineup] = useState({});
  const [bench, setBench] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [hoveredPlayer, setHoveredPlayer] = useState(null);

  // Animated puck movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPuckPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Mock player data with stats
  const mockPlayers = {
    forwards: [
      { 
        id: 1, 
        name: "Sarah Matthews", 
        team: "TOR", 
        position: "C", 
        points: 47, 
        goals: 22, 
        assists: 25, 
        status: "active",
        trend: "up",
        injury: null,
        nextGame: "vs MTL"
      },
      { 
        id: 2, 
        name: "Alex Thompson", 
        team: "BOS", 
        position: "LW", 
        points: 41, 
        goals: 18, 
        assists: 23, 
        status: "active",
        trend: "up",
        injury: null,
        nextGame: "@ NYR"
      },
      { 
        id: 3, 
        name: "Jordan Kim", 
        team: "NYR", 
        position: "RW", 
        points: 38, 
        goals: 21, 
        assists: 17, 
        status: "active",
        trend: "down",
        injury: null,
        nextGame: "vs BOS"
      },
      { 
        id: 4, 
        name: "Casey Rodriguez", 
        team: "MTL", 
        position: "C", 
        points: 35, 
        goals: 16, 
        assists: 19, 
        status: "active",
        trend: "up",
        injury: null,
        nextGame: "@ TOR"
      },
      { 
        id: 5, 
        name: "Riley Chen", 
        team: "VAN", 
        position: "LW", 
        points: 29, 
        goals: 12, 
        assists: 17, 
        status: "bench",
        trend: "up",
        injury: null,
        nextGame: "vs CGY"
      },
      { 
        id: 6, 
        name: "Morgan Taylor", 
        team: "CGY", 
        position: "RW", 
        points: 25, 
        goals: 11, 
        assists: 14, 
        status: "bench",
        trend: "down",
        injury: "day-to-day",
        nextGame: "@ VAN"
      }
    ],
    defense: [
      { 
        id: 7, 
        name: "Blake Anderson", 
        team: "EDM", 
        position: "D", 
        points: 31, 
        goals: 8, 
        assists: 23, 
        status: "active",
        trend: "up",
        injury: null,
        nextGame: "vs WPG"
      },
      { 
        id: 8, 
        name: "Quinn Parker", 
        team: "WPG", 
        position: "D", 
        points: 28, 
        goals: 6, 
        assists: 22, 
        status: "active",
        trend: "up",
        injury: null,
        nextGame: "@ EDM"
      },
      { 
        id: 9, 
        name: "Drew Wilson", 
        team: "OTT", 
        position: "D", 
        points: 22, 
        goals: 4, 
        assists: 18, 
        status: "bench",
        trend: "up",
        injury: null,
        nextGame: "vs MIN"
      },
      { 
        id: 10, 
        name: "Avery Johnson", 
        team: "MIN", 
        position: "D", 
        points: 18, 
        goals: 3, 
        assists: 15, 
        status: "bench",
        trend: "down",
        injury: null,
        nextGame: "@ OTT"
      }
    ],
    goalies: [
      { 
        id: 11, 
        name: "Taylor Williams", 
        team: "TOR", 
        position: "G", 
        wins: 18, 
        losses: 8, 
        saves: 892, 
        savePercentage: 0.924,
        status: "active",
        trend: "up",
        injury: null,
        nextGame: "vs MTL"
      },
      { 
        id: 12, 
        name: "Jamie Davis", 
        team: "BOS", 
        position: "G", 
        wins: 15, 
        losses: 10, 
        saves: 756, 
        savePercentage: 0.918,
        status: "bench",
        trend: "up",
        injury: null,
        nextGame: "@ NYR"
      }
    ]
  };

  // Initialize lineup
  useEffect(() => {
    const initialLineup = {
      C1: mockPlayers.forwards.find(p => p.position === 'C' && p.status === 'active'),
      C2: mockPlayers.forwards.filter(p => p.position === 'C' && p.status === 'active')[1] || null,
      LW1: mockPlayers.forwards.find(p => p.position === 'LW' && p.status === 'active'),
      LW2: mockPlayers.forwards.filter(p => p.position === 'LW' && p.status === 'active')[1] || null,
      RW1: mockPlayers.forwards.find(p => p.position === 'RW' && p.status === 'active'),
      RW2: mockPlayers.forwards.filter(p => p.position === 'RW' && p.status === 'active')[1] || null,
      D1: mockPlayers.defense[0],
      D2: mockPlayers.defense[1],
      D3: mockPlayers.defense[2] || null,
      D4: mockPlayers.defense[3] || null,
      G1: mockPlayers.goalies[0],
      G2: mockPlayers.goalies[1] || null
    };
    
    setLineup(initialLineup);
    
    const benchPlayers = [
      ...mockPlayers.forwards.filter(p => p.status === 'bench'),
      ...mockPlayers.defense.filter(p => p.status === 'bench'),
      ...mockPlayers.goalies.filter(p => p.status === 'bench')
    ];
    setBench(benchPlayers);
  }, []);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setSelectedPlayer(null);
  };

  const swapPlayer = (position, newPlayer) => {
    const currentPlayer = lineup[position];
    
    setLineup(prev => ({
      ...prev,
      [position]: newPlayer
    }));
    
    if (currentPlayer) {
      setBench(prev => [...prev.filter(p => p.id !== newPlayer.id), currentPlayer]);
    } else {
      setBench(prev => prev.filter(p => p.id !== newPlayer.id));
    }
    
    setSelectedPlayer(null);
  };

  const PlayerCard = ({ player, position, isLineup = true }) => {
    if (!player) {
      return (
        <div className="bg-white/10 border border-dashed border-white/30 rounded-2xl p-4 h-32 flex items-center justify-center">
          <span className="text-purple-300 text-sm">Empty Slot</span>
        </div>
      );
    }

    return (
      <div 
        className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-300 transform hover:scale-105 hover:bg-white/20 cursor-pointer group relative overflow-hidden ${
          editMode ? 'hover:border-purple-400' : ''
        } ${selectedPlayer?.id === player.id ? 'ring-2 ring-purple-400' : ''}`}
        onClick={() => editMode && setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)}
        onMouseEnter={() => setHoveredPlayer(player)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Player info */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                player.position === 'G' ? 'bg-orange-500' :
                player.position === 'D' ? 'bg-blue-500' :
                'bg-green-500'
              }`}>
                {player.position}
              </div>
              <span className="text-white font-semibold text-sm">{player.team}</span>
            </div>
            <div className="flex items-center space-x-1">
              {player.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              {player.injury && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
          
          <h3 className="text-white font-bold text-sm mb-1 group-hover:text-purple-200 transition-colors">
            {player.name}
          </h3>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {player.position === 'G' ? (
              <>
                <div className="text-purple-200">
                  <span className="text-white font-semibold">{player.wins}</span> W
                </div>
                <div className="text-purple-200">
                  <span className="text-white font-semibold">{(player.savePercentage * 100).toFixed(1)}%</span> SV%
                </div>
              </>
            ) : (
              <>
                <div className="text-purple-200">
                  <span className="text-white font-semibold">{player.goals}</span> G
                </div>
                <div className="text-purple-200">
                  <span className="text-white font-semibold">{player.assists}</span> A
                </div>
              </>
            )}
          </div>
          
          <div className="mt-2 text-xs text-purple-300">
            Next: {player.nextGame}
          </div>
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

  const totalPoints = Object.values(lineup).reduce((sum, player) => {
    if (!player) return sum;
    return sum + (player.points || player.wins || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ice rink lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-white opacity-10 transform rotate-12"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-white opacity-10 transform -rotate-12"></div>
        
        {/* Floating pucks */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-white rounded-full opacity-5 animate-bounce"></div>
        <div className="absolute bottom-32 right-32 w-6 h-6 bg-white rounded-full opacity-5 animate-ping"></div>
        
        {/* Moving puck */}
        <div 
          className="absolute top-1/3 w-4 h-4 bg-white rounded-full opacity-20 transition-all duration-100"
          style={{ left: `${puckPosition}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Zap className="w-10 h-10 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Puck<span className="text-purple-300"> Yeah!</span></h1>
              <p className="text-purple-200 text-sm">My Team</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                editMode 
                  ? 'bg-green-600 text-white hover:bg-green-500' 
                  : 'bg-purple-600 text-white hover:bg-purple-500'
              }`}
            >
              {editMode ? (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Lineup</span>
                </div>
              )}
            </button>
            <button className="p-2 text-purple-200 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-purple-200 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalPoints}</div>
            <div className="text-purple-200 text-sm">Total Points</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Star className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-purple-200 text-sm">Active Players</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">4</div>
            <div className="text-purple-200 text-sm">Bench Players</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">#3</div>
            <div className="text-purple-200 text-sm">League Rank</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Lineup Section */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Forwards */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">F</span>
                </div>
                Forwards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-purple-200 text-sm font-semibold mb-3">Centers</h3>
                  <div className="space-y-3">
                    <PlayerCard player={lineup.C1} position="C1" />
                    <PlayerCard player={lineup.C2} position="C2" />
                  </div>
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm font-semibold mb-3">Left Wings</h3>
                  <div className="space-y-3">
                    <PlayerCard player={lineup.LW1} position="LW1" />
                    <PlayerCard player={lineup.LW2} position="LW2" />
                  </div>
                </div>
                <div>
                  <h3 className="text-purple-200 text-sm font-semibold mb-3">Right Wings</h3>
                  <div className="space-y-3">
                    <PlayerCard player={lineup.RW1} position="RW1" />
                    <PlayerCard player={lineup.RW2} position="RW2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Defense */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                Defense
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlayerCard player={lineup.D1} position="D1" />
                <PlayerCard player={lineup.D2} position="D2" />
                <PlayerCard player={lineup.D3} position="D3" />
                <PlayerCard player={lineup.D4} position="D4" />
              </div>
            </div>

            {/* Goalies */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                Goalies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlayerCard player={lineup.G1} position="G1" />
                <PlayerCard player={lineup.G2} position="G2" />
              </div>
            </div>
          </div>

          {/* Bench Section */}
          <div className="space-y-8">
            
            {/* Bench Players */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-purple-300" />
                Bench
              </h2>
              <div className="space-y-4">
                {bench.map((player, index) => (
                  <div 
                    key={player.id}
                    onClick={() => editMode && selectedPlayer && swapPlayer(Object.keys(lineup).find(pos => lineup[pos]?.id === selectedPlayer.id), player)}
                    className={`${editMode && selectedPlayer ? 'cursor-pointer hover:ring-2 hover:ring-green-400' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PlayerCard player={player} isLineup={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Player Stats Panel */}
            {hoveredPlayer && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Player Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Name:</span>
                    <span className="text-white font-semibold">{hoveredPlayer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Team:</span>
                    <span className="text-white font-semibold">{hoveredPlayer.team}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Position:</span>
                    <span className="text-white font-semibold">{hoveredPlayer.position}</span>
                  </div>
                  {hoveredPlayer.position === 'G' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Wins:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Save %:</span>
                        <span className="text-white font-semibold">{(hoveredPlayer.savePercentage * 100).toFixed(1)}%</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Points:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.points}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Goals:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.goals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-200">Assists:</span>
                        <span className="text-white font-semibold">{hoveredPlayer.assists}</span>
                      </div>
                    </>
                  )}
                  {hoveredPlayer.injury && (
                    <div className="flex justify-between">
                      <span className="text-purple-200">Status:</span>
                      <span className="text-red-400 font-semibold">{hoveredPlayer.injury}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Edit Mode Instructions */}
            {editMode && (
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-6 border border-purple-400/30 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-3">Edit Mode Active</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p>1. Click a player in your lineup</p>
                  <p>2. Click a bench player to swap</p>
                  <p>3. Click "Save" when done</p>
                </div>
                {selectedPlayer && (
                  <div className="mt-4 p-3 bg-white/10 rounded-xl">
                    <p className="text-white text-sm">
                      Selected: <span className="font-semibold">{selectedPlayer.name}</span>
                    </p>
                    <p className="text-purple-200 text-xs">Click a bench player to swap</p>
                  </div>
                )}
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
        
        .animate-slide-up:nth-child(1) { animation-delay: 0.1s; }
        .animate-slide-up:nth-child(2) { animation-delay: 0.2s; }
        .animate-slide-up:nth-child(3) { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default MyTeam;