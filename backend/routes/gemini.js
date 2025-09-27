const express = require('express');
const fetch = require('node-fetch'); // or native fetch if Node 18+
require('dotenv').config();

console.log('Gemini route file loaded, environment variables:', {
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY ? 'Present' : 'Missing'
});

const router = express.Router();
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

console.log('Gemini route file loaded, API_KEY:', API_KEY ? 'Present' : 'Missing');

// root
router.get('/', async (req, res) => {
  console.log('Received request to /api/gemini');

  const promptText = `
    Provide the latest PWHL women's hockey news, recent plays, and fantasy hockey league relevant stats.
    Focus on recent games and standout players.
  `;
  console.log('Prompt text prepared');

  try {
    console.log('Sending request to Gemini API...');

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
          }
        }),
      }
    );
    console.log('Gemini API responded with status:', response.status);

    // if response is not ok, log the error
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      return res.status(500).json({ commentary: "Error from Gemini API." });
    }

    // Parse JSON response
    const data = await response.json();
    console.log('Gemini API JSON parsed:', JSON.stringify(data).slice(0, 200) + '...'); // print first 200 chars

    // Extract commentary from response
    const commentary = data.candidates?.[0]?.content?.parts?.[0]?.text || "No commentary available.";
    console.log('Extracted commentary:', commentary);

    // Send commentary back to client
    res.json({ commentary });
  }
  catch (error) {
    console.error('Fetch error caught:', error);
    res.status(500).json({ commentary: "Error fetching commentary." });
  }
});

module.exports = router;
