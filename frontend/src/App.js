import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Auth from './Components/Auth/Auth';
import PlayerDraft from './Components/PlayerDraft/PlayerDraft';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/draft" element={<PlayerDraft/>}/>
      </Routes>
    </Router>
  );
}

export default App;