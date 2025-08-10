import { useState } from 'react';
import callGeminiAPI from '../utils/callGeminiAPI.js';

export default function PhaseModal({ phase, onClose, onUpdateTitle, bars = [] }) {
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);

  if (!phase) return null;

  const handleReflect = async () => {
    setLoading(true);
    try {
      const text = await callGeminiAPI(phase, 'reflect');
      setReflection(text);
    } catch (err) {
      setReflection('Failed to fetch reflection: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTitle = async () => {
    setLoading(true);
    try {
      const title = await callGeminiAPI(phase, 'title');
      onUpdateTitle(title);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Filter bars within phase dates
  const phaseStart = new Date(phase.start);
  const phaseEnd = new Date(phase.end);
  const barsInPhase = bars.filter(bar => {
    const barStart = new Date(bar.start);
    const barEnd = new Date(bar.end);
    return barStart >= phaseStart && barEnd <= phaseEnd;
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div
        className="bg-panel text-text p-6 rounded shadow-glow max-w-lg w-full relative"
        style={{ overflow: 'hidden', height: '520px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <button className="absolute top-2 right-2 text-gold" onClick={onClose}>
          ✕
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold flex-1">{phase.name}</h2>
          <button onClick={handleTitle} className="text-gold">
            ✨
          </button>
        </div>
        <div className="flex gap-2 items-center mb-2">
          <label className="text-black font-semibold">Start:</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-black"
            value={phase.start instanceof Date ? phase.start.toISOString().slice(0, 10) : ''}
            onChange={e => onUpdateTitle({ ...phase, start: new Date(e.target.value) })}
          />
          <label className="text-black font-semibold">End:</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-black"
            value={phase.end instanceof Date ? phase.end.toISOString().slice(0, 10) : ''}
            onChange={e => onUpdateTitle({ ...phase, end: new Date(e.target.value) })}
          />
        </div>
        <p className="text-sm text-muted mb-2">
          {phase.start.toDateString()} - {phase.end.toDateString()}
        </p>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {Object.entries(phase).map(
            ([k, v]) =>
              !['name', 'start', 'end', 'strand'].includes(k) && v ? (
                <p key={k} className="mb-1">
                  <span className="text-gold">{k}: </span>
                  {typeof v === 'object' ? JSON.stringify(v) : v}
                </p>
              ) : null
          )}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Bars in this phase:</h3>
            {barsInPhase.length === 0 ? (
              <div className="text-muted">No bars in this phase.</div>
            ) : (
              <ul className="list-disc pl-4">
                {barsInPhase.map((bar, idx) => (
                  <li key={idx} className="mb-1">{bar.name || bar.title || 'Untitled'}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button
          onClick={handleReflect}
          className="mt-4 px-3 py-1 bg-background border border-gold rounded shadow-glow"
        >
          Reflect on this Phase
        </button>
        {loading && <p className="mt-2 text-muted">Loading...</p>}
        {reflection && <p className="mt-2 whitespace-pre-line">{reflection}</p>}
      </div>
    </div>
  );
}
