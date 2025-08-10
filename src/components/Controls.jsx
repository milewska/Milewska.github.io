import { useEffect, useState } from 'react';
import { listTables, fetchTableRecords } from '../utils/fetchAirtable.js';

export default function Controls({ setPhases, zoom, setZoom }) {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState([]);
  const softPalette = [
    '#FFD6E0', '#D6F5FF', '#E0FFD6', '#FFF5D6', '#E0E0FF', '#FFE0F5', '#D6FFF5', '#F5E0FF',
  ];
  const [colors, setColors] = useState({});
  const [showPicker, setShowPicker] = useState({});

  useEffect(() => {
    listTables().then((tbls) => {
      setTables(tbls);
      // Assign default colors if not set
      setColors((prev) => {
        const next = { ...prev };
        tbls.forEach((t, i) => {
          if (!next[t]) next[t] = softPalette[i % softPalette.length];
        });
        return next;
      });
    }).catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    async function load() {
      const results = [];
      for (const t of selected) {
        const phases = await fetchTableRecords(t);
        // Attach color to each phase
        results.push(...phases.map(p => ({ ...p, color: colors[t] })));
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
        {tables.map((name, i) => (
          <span key={name} className="flex items-center gap-2 relative">
            <input
              type="checkbox"
              checked={selected.includes(name)}
              onChange={() => toggle(name)}
            />
            <span
              style={{
                background: colors[name] || softPalette[i % softPalette.length],
                color: '#222',
                padding: '2px 10px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: `0 0 8px 2px ${colors[name] || softPalette[i % softPalette.length]}`,
                border: '2px solid #fff',
              }}
              onClick={() => setShowPicker(s => ({ ...s, [name]: true }))}
              title={`Click to change color for ${name}`}
            >
              {name}
            </span>
            {showPicker[name] && (
              <input
                type="color"
                value={colors[name] || softPalette[i % softPalette.length]}
                onChange={e => { setColors(c => ({ ...c, [name]: e.target.value })); setShowPicker(s => ({ ...s, [name]: false })); }}
                style={{
                  position: 'absolute',
                  left: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 32,
                  height: 32,
                  border: 'none',
                  background: 'none',
                  boxShadow: '0 0 8px 2px #ffd',
                  borderRadius: '60% 60% 80% 80% / 60% 60% 100% 100%',
                  WebkitMaskImage: 'radial-gradient(circle at 50% 40%, white 80%, transparent 100%)',
                  maskImage: 'radial-gradient(circle at 50% 40%, white 80%, transparent 100%)',
                  outline: '2px solid #888',
                  cursor: 'pointer',
                }}
                title={`Color for ${name}`}
                onBlur={() => setShowPicker(s => ({ ...s, [name]: false }))}
                autoFocus
              />
            )}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => setZoom(Math.max(0.05, zoom - 0.1))}
          className="px-2 py-1 bg-background rounded shadow-glow"
        >
          -
        </button>
        <input
          type="range"
          min="0.05"
          max="5"
          step="0.01"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={{ width: '320px', margin: '0 12px' }}
        />
        <button
          onClick={() => setZoom(Math.min(5, zoom + 0.1))}
          className="px-2 py-1 bg-background rounded shadow-glow"
        >
          +
        </button>
      </div>
    </div>
  );
}
