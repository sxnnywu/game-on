import React from "react";
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

  const players = [
    { name: "Player 1", team: "Team A", position: "Forward", draft: "Drafted", goals: 5, assists: 3, saves: 0 },
    { name: "Player 2", team: "Team B", position: "Goalie", draft: "Available", goals: 0, assists: 1, saves: 15 },
    { name: "Player 3", team: "Team C", position: "Defense", draft: "Drafted", goals: 2, assists: 4, saves: 0 },
  ];

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
          <table className="w-full text-left text-white border-collapse">
            <thead>
              <tr className="bg-white/10 text-purple-200 sticky top-0">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Team</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Draft Status</th>
                <th className="px-4 py-2">Goals</th>
                <th className="px-4 py-2">Assists</th>
                <th className="px-4 py-2">Saves</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, idx) => (
                <tr key={idx} className="odd:bg-white/5 even:bg-white/0 hover:bg-purple-700/30 transition">
                  <td className="px-4 py-2">{player.name}</td>
                  <td className="px-4 py-2">{player.team}</td>
                  <td className="px-4 py-2">{player.position}</td>
                  <td className="px-4 py-2">{player.draft}</td>
                  <td className="px-4 py-2">{player.goals}</td>
                  <td className="px-4 py-2">{player.assists}</td>
                  <td className="px-4 py-2">{player.saves}</td>
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
