import { useEffect, useState } from 'react';
import { listTables, fetchTableRecords } from '../utils/fetchAirtable.js';

export default function Controls({ setPhases, zoom, setZoom }) {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    listTables().then(setTables).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    async function load() {
      const results = [];
      for (const t of selected) {
        const phases = await fetchTableRecords(t);
        results.push(...phases);
      }
      setPhases(results);
    }
    if (selected.length) {
      load();
    } else {
      setPhases([]);
    }
  }, [selected, setPhases]);

  const toggle = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-panel text-text shadow-lg flex-wrap">
      <div className="flex gap-2 flex-wrap">
        {tables.map((name) => (
          <label key={name} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(name)}
              onChange={() => toggle(name)}
            />
            {name}
          </label>
        ))}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
          className="px-2 py-1 bg-background rounded shadow-glow"
        >
          -
        </button>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
        />
        <button
          onClick={() => setZoom(Math.min(5, zoom + 0.5))}
          className="px-2 py-1 bg-background rounded shadow-glow"
        >
          +
        </button>
      </div>
    </div>
  );
}
