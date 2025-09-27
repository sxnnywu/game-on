import React, { useState } from 'react';
import './GeminiWidget.css';

const GeminiWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [commentary, setCommentary] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCommentary = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/gemini');
      const data = await response.json();
      setCommentary(data.commentary);
    } catch (error) {
      setCommentary('Failed to fetch commentary.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => {
    // If we're opening the commentary, fetch new data
    if (!expanded) {
      fetchCommentary();
    }
    setExpanded(!expanded);
  };

  return (
    <div className={`gemini-fab-container ${expanded ? 'expanded' : ''}`}>
      <button className="gemini-fab" onClick={toggleExpanded}>
        <span><img src="/assets/MrPuck.png" alt="MrPuck" width={40} height={40}/></span>
        <span className="fab-label">Hear Mr. Puck's Commentary</span>
      </button>

      {expanded && (
        <div className="gemini-commentary-box">
          <div className="gemini-commentary-header">🏒 Recent Insights</div>
          <div className="gemini-commentary-body">
            {loading ? <p>Loading latest commentary...</p> : <p>{commentary}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiWidget;
