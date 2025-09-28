import React, { useEffect, useState } from "react";
import { Zap, Users, TrendingUp, Star, Filter, Search } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const PlayerDraft = () => {
  const logos = [
    "/assets/icon1.png",
    "/assets/icon2.png",
    "/assets/icon3.png",
    "/assets/icon4.png",
    "/assets/icon5.png",
    "/assets/icon6.png",
    "/assets/icon7.png",
    "/assets/icon8.png",
  ];

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [draftState, setDraftState] = useState(null);

  // set current user from token
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

  // fetch players from backend
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://game-on-9bhv.onrender.com/api/players`);

        if (!response.ok) throw new Error("Failed to fetch players");

        const data = await response.json();
        console.log("Fetched players:", data);

        setPlayers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching players:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  // fetch draft state
  const fetchDraftState = async () => {
    if (!currentUser) return;
    const leagueID = currentUser.leagues[0];
    try {
      const response = await fetch(`https://game-on-9bhv.onrender.com/api/league/${leagueID}/draft`);
      if (!response.ok) throw new Error("Failed to fetch draft state");

      const data = await response.json();
      setDraftState(data);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch draft state
  useEffect(() => {
    if (!currentUser) return;
    fetchDraftState();
  }, [currentUser]);

  // filter players based on search and position
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const playerPos = player.position.toLowerCase(); // normalize
    const matchesPosition = selectedPosition === "all" || playerPos === selectedPosition.toLowerCase();
    return matchesSearch && matchesPosition;
  });
  const positions = [...new Set(players.map(p => p.position))];

  const getStatusBadge = (status) => (
    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
      {status ? "Active" : "Inactive"}
    </span>
  );

  const getDraftStatusBadge = (draftStatus) => {
    const colors = {
      'Available': 'bg-blue-100 text-blue-800',
      'Drafted': 'bg-purple-100 text-purple-800',
      'Reserved': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${colors[draftStatus] || 'bg-gray-100 text-gray-800'}`}>
        {draftStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-white text-xl">Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-red-500/20 text-white p-6 rounded-xl border border-red-500/30 max-w-md w-full text-center">
          Error loading players: {error}
        </div>
      </div>
    );
  }

  // make a draft pick
  const makeDraftPick = async (playerId) => {
    if (!currentUser || !draftState) return;

    const leagueID = currentUser.leagues[0];
    const teamId = currentUser.teamId; // assuming you store the user's team

    try {
      const response = await fetch(`https://game-on-9bhv.onrender.com/api/league/${leagueID}/draft/pick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, playerId })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Draft pick failed");

      // update local state
      setPlayers(prev => prev.map(p => {
        if (p._id === playerId) {
          const leagueId = currentUser.leagues[0];
          const updatedDraftStatus = p.draftStatus.map(d =>
            d.leagueId === leagueId ? { ...d, status: 'drafted' } : d
          );
          return { ...p, draftStatus: updatedDraftStatus };
        }
        return p;
      }));

      // refresh draft state
      fetchDraftState();
      console.log("Draft pick successful:", data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const draftNextStep = async () => {
    if (!currentUser) return;
    const leagueID = currentUser.leagues[0];

    try {
      const response = await fetch(`https://game-on-9bhv.onrender.com/api/league/${leagueID}/draft`);
      if (!response.ok) throw new Error("Failed to fetch next draft step");
      const data = await response.json();
      setDraftState(data);
      console.log("Next draft step:", data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-3 sm:p-4 lg:p-6">
      {/* Enhanced Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg sm:rounded-xl">
            <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
          </div>
          <div>
            <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">PUCK YEAH!</span>
            <div className="text-purple-200 text-xs sm:text-sm">Player Draft</div>
          </div>
        </div>
        <div className="text-white text-bold text-xl"><a href="/dashboard">DASHBOARD</a></div> 
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{players.length} Players</span>
          </div>
          <a
            href="/"
            className="text-white text-sm sm:text-base font-semibold hover:text-purple-300 transition-colors px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/10"
          >
            Home
          </a>
        </div>
      </nav>

      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Enhanced Team Logos Section */}
        <div className="w-full xl:w-80">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 mb-4 sm:mb-6">
            <h2 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400" />
              Teams
            </h2>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {logos.map((logo, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300 hover:border-purple-400/50">
                    <img
                      src={logo}
                      alt={`Team ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-white/70 text-xs text-center mt-1 sm:mt-2 group-hover:text-white transition-colors">
                    Team {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" />
              Quick Stats
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-white/70">Available Players</span>
                <span className="text-green-400 font-semibold">
                  {players.filter(p => p.draftStatus === 'Available').length}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-white/70">Drafted Players</span>
                <span className="text-purple-400 font-semibold">
                  {players.filter(p => p.draftStatus === 'Drafted').length}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-white/70">Active Players</span>
                <span className="text-blue-400 font-semibold">
                  {players.filter(p => p.status).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Player Table Section */}
        <div className="flex-1 min-w-0">
          {/* Search and Filter Bar */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-white/10 border border-white/30 rounded-lg sm:rounded-xl text-white text-sm sm:text-base placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full sm:w-auto pl-9 sm:pl-10 pr-6 sm:pr-8 py-2 bg-white/10 border border-white/30 rounded-lg sm:rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all" className="text-black">All Positions</option>
                  <option value="goalie" className="text-black">Goalies</option>
                  <option value="forward" className="text-black">Forwards</option>
                  <option value="defence" className="text-black">Defenders</option>
                  {positions.map(position => (
                    <option key={position} value={position} className="bg-purple-900">
                      {position}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3">
            {filteredPlayers.map((player) => (
              <div key={player._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
                onClick={() => makeDraftPick(player._id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-base">{player.name}</h3>
                    <p className="text-white/70 text-sm">{player.team}</p>
                  </div>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    {player.position}
                  </span>
                </div>

                <div className="flex gap-2 mb-3">
                  {getStatusBadge(player.status)}
                  {player.draftStatus.map((draft, i) => (
                    <React.Fragment key={i}>
                      {getDraftStatusBadge(draft.status.charAt(0).toUpperCase() + draft.status.slice(1))}
                    </React.Fragment>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Week Goals:</span>
                    <span className="text-green-400 font-semibold">{player.statsFromThisWeek?.goals || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Week Assists:</span>
                    <span className="text-blue-400 font-semibold">{player.statsFromThisWeek?.assists || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Goals:</span>
                    <span className="text-green-300">{player.stats?.goals || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Assists:</span>
                    <span className="text-blue-300">{player.stats?.assists || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl sm:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg">
            <table className="w-full text-xs sm:text-sm text-left text-white">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  {[
                    'Name', 'Team', 'Position', 'Status', 'Draft Status',
                    'Goals (Week)', 'Assists (Week)', 'Saves (Week)',
                    'Total Goals', 'Total Assists', 'Total Saves', 'Created'
                  ].map(header => (
                    <th key={header} className="px-2 sm:px-4 py-3 sm:py-4 text-left text-white font-semibold whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, index) => (
                  <tr
                    key={player._id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/2' : ''
                      }`}
                    onClick={() => makeDraftPick(player._id)}
                  >
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <div className="font-medium text-white">{player.name}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-white/80">{player.team}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                        {player.position}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">{getStatusBadge(player.status)}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4">{player.draftStatus.map((draft, i) => (
                      <React.Fragment key={i}>
                        {getDraftStatusBadge(draft.status.charAt(0).toUpperCase() + draft.status.slice(1))}
                      </React.Fragment>
                    ))}</td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                      <span className="text-green-400 font-semibold">
                        {player.statsFromThisWeek?.goals || 0}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                      <span className="text-blue-400 font-semibold">
                        {player.statsFromThisWeek?.assists || 0}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                      <span className="text-purple-400 font-semibold">
                        {player.statsFromThisWeek?.saves || 0}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                      <span className="text-green-300 font-medium">
                        {player.stats?.goals || 0}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                      <span className="text-blue-300 font-medium">
                        {player.stats?.assists || 0}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                      <span className="text-purple-300 font-medium">
                        {player.stats?.saves || 0}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-white/60 text-xs sm:text-sm">
                      {new Date(player.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-white/60">
              <Users className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-base sm:text-lg">No players found</p>
              <p className="text-xs sm:text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Continue Button */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <div></div>
        <div className="text-white/60 text-xs sm:text-sm justify-center">
          Showing {filteredPlayers.length} of {players.length} players
        </div>
        <div></div>
        <div className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
          <button onClick={draftNextStep}>
            Continue to Next Step
          </button>
          <Zap className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default PlayerDraft;