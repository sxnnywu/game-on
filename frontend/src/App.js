import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Auth from './Components/Auth/Auth';
import PlayerDraft from './Components/PlayerDraft/PlayerDraft';
import React from 'react';
import GeminiWidget from './Components/GeminiWidget/GeminiWidget';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/draft" element={<PlayerDraft/>}/>
        <Route path="/gemini" element={<GeminiWidget/>} />
      </Routes>
    </Router>
  );
}

export default App;