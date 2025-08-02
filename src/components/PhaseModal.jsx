import { useState } from 'react';
import callGeminiAPI from '../utils/callGeminiAPI.js';

export default function PhaseModal({ phase, onClose, onUpdateTitle }) {
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-panel text-text p-6 rounded shadow-glow max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gold" onClick={onClose}>
          ✕
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold flex-1">{phase.name}</h2>
          <button onClick={handleTitle} className="text-gold">
            ✨
          </button>
        </div>
        <p className="text-sm text-muted mb-2">
          {phase.start.toDateString()} - {phase.end.toDateString()}
        </p>
        {Object.entries(phase).map(
          ([k, v]) =>
            !['name', 'start', 'end', 'strand'].includes(k) && v ? (
              <p key={k} className="mb-1">
                <span className="text-gold">{k}: </span>
                {v}
              </p>
            ) : null
        )}
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
