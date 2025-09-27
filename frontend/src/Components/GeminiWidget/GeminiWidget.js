import React, { useState, useEffect } from 'react';
import './GeminiWidget.css';

const GeminiWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [commentary, setCommentary] = useState('Loading commentary...');

  const toggleExpanded = () => setExpanded(!expanded);

  useEffect(() => {
    // Replace with your actual Gemini API call
    const fetchGeminiCommentary = async () => {
      try {
        const response = await fetch('/api/gemini-commentary');
        const data = await response.json();
        setCommentary(data.commentary);
      } catch (err) {
        setCommentary('Unable to fetch commentary.');
      }
    };

    fetchGeminiCommentary();
  }, []);

  return (
    <div className={`gemini-widget ${expanded ? 'expanded' : ''}`} onClick={toggleExpanded}>
      <div className="gemini-header z-50">
        🏒 AI Commentary
      </div>
      {expanded && (
        <div className="gemini-body">
          <p>{commentary}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiWidget;
