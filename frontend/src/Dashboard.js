import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { Users, Trophy, Plus, Crown, Calendar, Target, Zap, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ setLeagueId, setTeamId }) => {
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
  const [leagues, setLeagues] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const navigate = useNavigate();

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
        setCurrentUser(decoded);
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  useEffect(() => {
    console.log("Current user in dashboard:", currentUser);
  }, [currentUser]);

  const generateLeagueCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const link = `https://puckyeah.com/join/${code}`;
    setLeagueCode(code);
    setInviteLink(link);
  };

  // create league
  const createLeagueInDB = async () => {
    if (!leagueName.trim() || !currentUser) return;

    generateLeagueCode();
    setShowCreateLeague(false);
    setShowInviteModal(true);

    const leagueData = {
      name: leagueName,
      creatorId: currentUser.id,
      code: leagueCode,
      link: inviteLink
    };

    try {
      console.log("Creating league with data:", leagueData);
      const res = await fetch('https://game-on-9bhv.onrender.com/api/leagues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(leagueData)
      });
      console.log("Create league response:", res);
      if (!res.ok) throw new Error('Failed to create league');
      const data = await res.json();
      console.log('League created:', data);
    } catch (err) {
      console.error(err);
    }
  };

  // join league
  const joinLeague = async () => {
    if (!currentUser || !joinCode.trim()) return;

    console.log("Attempting to join league with code:", joinCode);

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
      console.log("Join response:", res);

      if (!res.ok) throw new Error("Failed to join league");
      const data = await res.json();
      console.log("Joined league:", data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const leaveLeague = async (leagueId) => {
  console.log("Attempting to leave league with ID:", leagueId);
  if (!currentUser) return;

  try {
    const res = await fetch(
      `https://game-on-9bhv.onrender.com/api/leagues/${leagueId}/leave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: currentUser.id }),
      }
    );

    if (!res.ok) throw new Error("Failed to leave league");

    // ✅ Update state locally instead of full page reload
    setLeagues(prevLeagues => prevLeagues.filter(l => l.id !== leagueId));

    // ✅ Close modal
    setShowLeagueDetails(false);
    setSelectedLeague(null);

    console.log("Successfully left league:", leagueId);
  } 
  catch (err) {
    console.error(err);
  }
};


  const openLeagueDetails = (league) => {
  setSelectedLeague(league);

  // tell App.js which league/team are selected
  setLeagueId(league.id); 
  setTeamId("TEMP_TEAM_ID"); // replace with real team id once available

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
    localStorage.removeItem('token');
    navigate('/');
  };

  // Fetch leagues from backend
  useEffect(() => {
    const fetchLeagues = async () => {
      if (!currentUser || !token) return;

      try {
        const res = await fetch(`https://game-on-9bhv.onrender.com/api/leagues/${currentUser.id}/leagues`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to fetch leagues');
        const data = await res.json();

        // Map the backend league data to match the fields used in component
        const mappedLeagues = data.leagues.map(league => ({
          id: league._id,
          name: league.name,
          members: league.teamIds?.length || 0,
          maxMembers: league.maxMembers || 12, // default if not stored
          code: league.code || league._id.substring(0, 6).toUpperCase(), // fallback code
          isOwner: league.creatorId?._id === currentUser.id
        }));
        setLeagues(mappedLeagues);
      }
      catch (err) {
        console.error(err);
      }
    };
    fetchLeagues();
  }, [currentUser, token]);

  // const mockMatchups = [
  //   { id: 1, opponent: "Sarah M.", date: "Oct 15", status: "upcoming", myScore: 0, opponentScore: 0 },
  //   { id: 2, opponent: "Alex K.", date: "Oct 12", status: "won", myScore: 142, opponentScore: 128 },
  //   { id: 3, opponent: "Jordan T.", date: "Oct 8", status: "lost", myScore: 115, opponentScore: 134 }
  // ];

  // Fetch matchups from backend
  useEffect(() => {
    const fetchMatchups = async () => {

      console.log("Fetching matchups for user:", currentUser);

      // If user or token missing, skip
      if (!currentUser || !token) return;

      try {
        const res = await fetch(
          `https://game-on-9bhv.onrender.com/api/matchups/user/${currentUser.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        console.log("Matchups response:", res);
        if (!res.ok) throw new Error('Failed to fetch matchups');
        const data = await res.json();
        console.log("Matchups response JSON", data);

        // Map backend → frontend shape
        const mappedMatchups = data.matchups.map(match => ({
          teamA: match.teamAId,
          teamB: match.teamBId,
          scoreA: match.scoreA,
          scoreB: match.scoreB,
          status: match.status,
          week: match.week
        }));
        setMatchups(mappedMatchups);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatchups();
  }, [currentUser, token]);


  return (
    <>
      {/* Main dashboard container */}
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">

        {/* Animated background */}
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

          {/* Create & Join League Row */}
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

          {/* Upcoming Drafts */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-purple-300" />
              Upcoming Drafts
            </h2>
            <div className="space-y-4">
              <div className="cursor-pointer bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white flex items-center">
                    Women’s Fantasy Hockey Draft
                  </h3>
                  <span className="text-xs text-purple-300 font-mono">NOW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Drafting in progress ⏱️</span>
                  <button
                    onClick={() => navigate('/draft')}
                    className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* My Leagues */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-3 text-purple-300" />
              My Leagues
            </h2>
            <div className="space-y-4">
              {leagues.map((league) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Matchups */}
          <div className="max-w-[77rem] mx-auto -mt-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 mb-8 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-purple-300" />
                Recent Matchups
              </h2>
              <div className="space-y-4">
                {matchups.map((match) => (
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
                            <span className="text-green-400 font-bold">{match.myScore}</span>
                            <span className="text-purple-200">-</span>
                            <span className="text-red-400 font-bold">{match.opponentScore}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Create League Modal */}
      {showCreateLeague && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-96 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Create League</h2>
            <input
              type="text"
              placeholder="League Name"
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              className="w-full p-3 rounded-lg mb-4 text-black"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateLeague(false)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={createLeagueInDB}
                className="px-4 py-2 rounded-lg bg-green-600 text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join League Modal */}
      {showJoinLeague && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-96 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Join League</h2>
            <input
              type="text"
              placeholder="Enter League Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full p-3 rounded-lg mb-4 text-black"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowJoinLeague(false)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={joinLeague}
                className="px-4 py-2 rounded-lg bg-green-600 text-white"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-96 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Invite Players</h2>
            <div className="mb-4">
              <p className="text-purple-200 mb-2">League Code:</p>
              <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg border border-white/20">
                <span className="text-white">{leagueCode}</span>
                <button
                  onClick={() => copyToClipboard(leagueCode, 'code')}
                  className="text-purple-300 hover:text-white"
                >
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-purple-200 mb-2">Invite Link:</p>
              <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg border border-white/20">
                <span className="text-white text-sm truncate">{inviteLink}</span>
                <button
                  onClick={() => copyToClipboard(inviteLink, 'link')}
                  className="text-purple-300 hover:text-white"
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* League Details Modal */}
      {showLeagueDetails && selectedLeague && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 w-96 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">{selectedLeague.name}</h2>
            <p className="text-purple-200 mb-4">{selectedLeague.members}/{selectedLeague.maxMembers} members</p>
            <div className="flex justify-end space-x-2">
              {selectedLeague.isOwner && (
                <button
                  onClick={() => copyToClipboard(selectedLeague.code, 'code')}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white"
                >
                  Copy Code
                </button>
              )}
              <button
                onClick={() => leaveLeague(selectedLeague.id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Leave League
              </button>
              <button
                onClick={() => setShowLeagueDetails(false)}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
