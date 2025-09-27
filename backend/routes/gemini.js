// /api/gemini-commentary endpoint (pseudo-code)
app.get('/api/gemini-commentary', async (req, res) => {
  const prompt = "Give recent hockey stats and AI commentary for women's fantasy league.";
  
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const data = await response.json();
  const commentary = data.candidates?.[0]?.content?.parts?.[0]?.text || "No commentary available.";

  res.json({ commentary });
});