import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Auth from './Components/Auth/Auth';
import PlayerDraft from './Components/PlayerDraft/PlayerDraft';
import GeminiWidget from './Components/GeminiWidget/GeminiWidget';
import MyTeam from './MyTeam';
import Temp from './Components/Temp/Temp';

function App() {
  const [user, setUser] = useState(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  return (
    <>
      <GeminiWidget />
      <Router>
        <Routes>
          <Route path="/" element={<Auth setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={<Dashboard setLeagueId={setSelectedLeagueId} setTeamId={setSelectedTeamId} />}
          />
          <Route path="/draft" element={<PlayerDraft />} />
          <Route path="/gemini" element={<GeminiWidget />} />
          <Route path="/*" element={<GeminiWidget />} />
          <Route
            path="/myteam"
            element={
              <MyTeam
                userId={user?._id}
                leagueId={selectedLeagueId}
                teamId={selectedTeamId}
              />
            }
          />
          <Route path="/temp" element={<Temp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
