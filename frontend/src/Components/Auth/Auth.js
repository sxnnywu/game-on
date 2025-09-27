import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Users, Trophy, Plus, Copy, Share2, Crown, Calendar, Target, Zap, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [puckPosition, setPuckPosition] = useState(0);
  const [leagueName, setLeagueName] = useState('');
  const [showCreateLeague, setShowCreateLeague] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [leagueCode, setLeagueCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showJoinLeague, setShowJoinLeague] = useState(false);
  const [showLeagueDetails, setShowLeagueDetails] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

    const generateLeagueCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const link = `https://puckyeah.com/join/${code}`;
    setLeagueCode(code);
    setInviteLink(link);
  };

  // Animated puck movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPuckPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    try {
      const decoded = jwtDecode(storedToken);
      setCurrentUser(decoded); // { id: "...", username: "..." }
      setToken(storedToken);   // save token to state so other functions can access it
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
}, []);

const createLeague = () => {
  if (!leagueName.trim() || !currentUser) return;

  generateLeagueCode(); // this updates leagueCode + inviteLink in state
  setShowCreateLeague(false);
  setShowInviteModal(true);

  const leagueData = {
    name: leagueName,
    creatorId: currentUser.id,
    code: leagueCode,     // grab from state if you need to save
    link: inviteLink
  };

  createLeagueInDB(leagueData);
};

const joinLeague = async () => {
  if (!currentUser || !joinCode.trim()) return;

  try {
    const res = await fetch(
      `https://game-on-9bhv.onrender.com/api/leagues/${joinCode}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: currentUser.id }),
      }
    );

    if (!res.ok) throw new Error("Failed to join league");
    const data = await res.json();
    console.log("Joined league:", data);
  } catch (err) {
    console.error("Error:", err);
  }
};

const leaveLeague = async (leagueId) => {
  if (!currentUser) return;

  const res = await fetch(
    `https://game-on-9bhv.onrender.com/api/leagues/${leagueId}/leave`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: currentUser.id }), // <-- use currentUser.id
    }
  );
};

  const openLeagueDetails = (league) => {
    setSelectedLeague(league);
    setShowLeagueDetails(true);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // clear token
    navigate('/'); // or '/auth' depending on your route
  };

const createLeagueInDB = async () => {
  const leagueData = {
    name: leagueName,
    creatorId: currentUser.id,
  };

  try {
    const token = localStorage.getItem('token');
    const res = await fetch('https://game-on-9bhv.onrender.com/api/leagues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(leagueData)
    });

    if (!res.ok) throw new Error('Failed to create league');
    const data = await res.json();
    console.log('League created:', data);
  } catch (err) {
    console.error(err);
  }
};

  const mockLeagues = [
    { id: 1, name: "Ice Queens League", members: 8, maxMembers: 12, code: "ICE2024", isOwner: true },
    { id: 2, name: "Slap Shot Sisters", members: 6, maxMembers: 10, code: "SLAP99", isOwner: false },
    { id: 3, name: "Power Play Pros", members: 12, maxMembers: 12, code: "PWR123", isOwner: false }
  ];

  const mockMatchups = [
    { id: 1, opponent: "Sarah M.", date: "Oct 15", status: "upcoming", myScore: 0, opponentScore: 0 },
    { id: 2, opponent: "Alex K.", date: "Oct 12", status: "won", myScore: 142, opponentScore: 128 },
    { id: 3, opponent: "Jordan T.", date: "Oct 8", status: "lost", myScore: 115, opponentScore: 134 }
  ];

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
              <h1 className="text-2xl font-bold text-white">PUCK<span className="text-purple-300"> YEAH!</span></h1>
              <p className="text-purple-200 text-sm">Welcome back, {currentUser ? currentUser.username : "User"}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-purple-200 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-purple-200 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-purple-200 text-sm">Leagues Joined</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">7</div>
            <div className="text-purple-200 text-sm">Wins</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">26</div>
            <div className="text-purple-200 text-sm">Total Players</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
            <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">#2</div>
            <div className="text-purple-200 text-sm">Best Rank</div>
          </div>
        </div>

        {/* Top Row: Create & Join League */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Create League */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Plus className="w-6 h-6 mr-3 text-purple-300" />
              Create Your League
            </h2>
            <p className="text-purple-200 mb-6">Start your own fantasy hockey league and invite friends to compete!</p>
            <button
              onClick={() => setShowCreateLeague(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="relative z-10">CREATE LEAGUE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

          {/* Join League */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-purple-300" />
              Join a League
            </h2>
            <p className="text-purple-200 mb-6">Enter a code to join your friends’ fantasy hockey league!</p>
            <button
              onClick={() => setShowJoinLeague(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:from-purple-500 hover:to-purple-600 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
            >
              <span className="relative z-10">JOIN LEAGUE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </div>

        {/* My Leagues (full width) */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-purple-300" />
            My Leagues
          </h2>
          <div className="space-y-4">
            {mockLeagues.map((league) => (
              <div
                key={league.id}
                onClick={() => openLeagueDetails(league)}
                className="cursor-pointer bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white flex items-center">
                    {league.name}
                    {league.isOwner && <Crown className="w-4 h-4 ml-2 text-yellow-400" />}
                  </h3>
                  <span className="text-xs text-purple-300 font-mono">{league.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">
                    {league.members}/{league.maxMembers} members
                  </span>
                  <span className="text-purple-300 text-xs">{league.draftStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>




        {/* League Details Modal */}
        {showLeagueDetails && selectedLeague && (
          <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto animate-fade-in">
              <div className="p-8 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-white flex items-center">
                    {selectedLeague.name}
                    {selectedLeague.isOwner && <Crown className="w-6 h-6 ml-3 text-yellow-400" />}
                  </h2>
                  <button
                    onClick={() => setShowLeagueDetails(false)}
                    className="text-purple-200 hover:text-white transition-colors p-2"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-white font-bold text-lg">{selectedLeague.members}/{selectedLeague.maxMembers}</div>
                    <div className="text-purple-200 text-sm">Members</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-white font-bold text-lg">{selectedLeague.draftStatus}</div>
                    <div className="text-purple-200 text-sm">Draft Status</div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">League Code:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white bg-white/10 px-3 py-1 rounded">{selectedLeague.code}</span>
                      <button
                        onClick={() => copyToClipboard(selectedLeague.code, 'code')}
                        className="p-1 text-purple-300 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => leaveLeague(selectedLeague.id)}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl hover:from-red-500 hover:to-red-600 transition-all"
                >
                  Leave League
                </button>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-300" />
                  League Standings
                </h3>
                <div className="space-y-3">
                  {selectedLeague.memberList?.map((member) => (
                    <div key={member.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                      <span className="text-white">{member.name}</span>
                      <span className="text-purple-300 text-sm">#{member.rank}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Recent Matchups (full width, same style as My Leagues) */}
      <div className="max-w-[77rem] mx-auto -mt-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-purple-300" />
            Recent Matchups
          </h2>
          <div className="space-y-4">
            {mockMatchups.map((match) => (
              <div
                key={match.id}
                className="cursor-pointer bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">VS</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{match.opponent}</h3>
                      <p className="text-purple-200 text-sm">{match.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {match.status === 'upcoming' ? (
                      <span className="text-yellow-400 text-sm font-semibold">UPCOMING</span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold">{match.myScore}</span>
                        <span className="text-purple-300">-</span>
                        <span className="text-white font-bold">{match.opponentScore}</span>
                        <span className={`text-sm font-semibold ml-2 ${match.status === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                          {match.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create League Modal */}
      {showCreateLeague && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Create New League</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="League Name"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-white transition-all"
              />
              <select className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-white transition-all">
                <option value="8">8 Players</option>
                <option value="10">10 Players</option>
                <option value="12">12 Players</option>
                <option value="14">14 Players</option>
              </select>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowCreateLeague(false)}
                className="flex-1 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createLeague}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-2xl hover:from-purple-500 hover:to-purple-600 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Invite Friends</h3>
            <p className="text-purple-200 mb-6">Share this code or link with your friends to join your league!</p>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <label className="text-purple-200 text-sm block mb-2">League Code</label>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xl text-white bg-white/10 px-4 py-2 rounded-lg flex-1 text-center">{leagueCode}</span>
                  <button
                    onClick={() => copyToClipboard(leagueCode, 'code')}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all"
                  >
                    {copiedCode ? '✓' : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <label className="text-purple-200 text-sm block mb-2">Invite Link</label>
                <div className="flex items-center space-x-2">
                  <span className="text-white bg-white/10 px-4 py-2 rounded-lg flex-1 text-sm truncate">{inviteLink}</span>
                  <button
                    onClick={() => copyToClipboard(inviteLink, 'link')}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all"
                  >
                    {copiedLink ? '✓' : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInviteModal(false)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-2xl hover:from-purple-500 hover:to-purple-600 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Join League Modal */}
      {showJoinLeague && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">Join League</h3>
            <input
              type="text"
              placeholder="Enter League Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-white transition-all mb-6"
            />
            <div className="flex space-x-4">
              <button
                onClick={() => setShowJoinLeague(false)}
                className="flex-1 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={joinLeague}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-2xl hover:from-indigo-500 hover:to-indigo-600 transition-all"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

export default Dashboard;