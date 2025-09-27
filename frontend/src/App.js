import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Auth from './Components/Auth/Auth';
import PlayerDraft from './Components/PlayerDraft/PlayerDraft';
import React from 'react';
import GeminiWidget from './Components/GeminiWidget/GeminiWidget';
import MyTeam from './MyTeam';

function App() {
  return (

    <>
      <GeminiWidget/>

          <Router>
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/draft" element={<PlayerDraft/>}/>
<<<<<<< HEAD
        <Route path="/gemini" element={<GeminiWidget/>} />
=======
        <Route path="/*" element={<GeminiWidget/>} />
        <Route path="/myteam" element={<MyTeam/>} />
>>>>>>> anahat-branch
      </Routes>
    </Router>
    </>
  );
}

export default App;