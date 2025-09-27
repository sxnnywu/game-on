import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";

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

  useEffect(() => {
    fetch("..backend/routes/players")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col p-6">
      {/* Navbar */}
      <nav className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Zap className="w-10 h-10 text-white" />
          <span className="text-white text-2xl font-bold">GAMEON</span>
        </div>
        <a href="/" className="text-white font-semibold hover:text-purple-300">Home</a>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Team logos */}
        <div className="grid grid-cols-2 gap-2 place-items-center lg:w-1/3">
          {logos.map((logo, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                <img src={logo} alt={`Team ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* Player table */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 overflow-auto max-h-[600px]">
          <table className="table-auto border-collapse border border-gray-300 w-full">
  <thead>
    <tr>
      <th className="px-4 py-2 border">Name</th>
      <th className="px-4 py-2 border">Team</th>
      <th className="px-4 py-2 border">Position</th>
      <th className="px-4 py-2 border">Status</th>
      <th className="px-4 py-2 border">Draft Status</th>
      <th className="px-4 py-2 border">Goals (This Week)</th>
      <th className="px-4 py-2 border">Assists (This Week)</th>
      <th className="px-4 py-2 border">Saves (This Week)</th>
      <th className="px-4 py-2 border">Total Goals</th>
      <th className="px-4 py-2 border">Total Assists</th>
      <th className="px-4 py-2 border">Total Saves</th>
      <th className="px-4 py-2 border">Created At</th>
    </tr>
  </thead>
  <tbody>
    {players.map((player) => (
      <tr key={player._id}>
        <td className="px-4 py-2 border">{player.name}</td>
        <td className="px-4 py-2 border">{player.team}</td>
        <td className="px-4 py-2 border">{player.position}</td>
        <td className="px-4 py-2 border">
          {player.status ? "Active" : "Inactive"}
        </td>
        <td className="px-4 py-2 border">{player.draftStatus}</td>

        {/* Weekly stats */}
        <td className="px-4 py-2 border">{player.statsFromThisWeek?.goals}</td>
        <td className="px-4 py-2 border">{player.statsFromThisWeek?.assists}</td>
        <td className="px-4 py-2 border">{player.statsFromThisWeek?.saves}</td>

        {/* Total stats */}
        <td className="px-4 py-2 border">{player.stats?.goals}</td>
        <td className="px-4 py-2 border">{player.stats?.assists}</td>
        <td className="px-4 py-2 border">{player.stats?.saves}</td>

        <td className="px-4 py-2 border">
          {new Date(player.createdAt).toLocaleDateString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>

      {/* Continue button */}
      <div className="mt-6 flex justify-end">
        <a
          href="/next-page"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition"
        >
          Continue
        </a>
      </div>
    </div>
  );
};

export default PlayerDraft;
