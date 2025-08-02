export default async function callGeminiAPI(phase, type = 'reflect') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing Gemini API key');

  const prompt = type === 'title'
    ? `Suggest a short, poetic title for this life phase: ${JSON.stringify(phase)}`
    : `Reflect poetically on this life phase: ${JSON.stringify(phase)}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    } catch (err) {
      if (attempt++ >= 3) throw err;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
    }
  }
}
