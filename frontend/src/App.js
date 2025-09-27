<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
=======
import React from 'react';
import Auth from './Components/Auth/Auth';
import './App.css';      
import PlayerDraft from './Components/PlayerDraft/PlayerDraft';

function App() {
  return (
    <div>
      <Auth />
   </div>
>>>>>>> c171f1aa304691de05cc344d0cbdb2a71bf97cf8
  );
}

export default App;