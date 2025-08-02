import parseCSV from '../utils/parseCSV.js';

export default function Controls({ setPhases, zoom, setZoom }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const phases = parseCSV(evt.target.result);
        setPhases(phases);
      } catch (err) {
        alert(err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-panel text-text shadow-lg">
      <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
      <div className="flex items-center gap-2">
        <button onClick={() => setZoom(Math.max(0.5, zoom - 0.5))} className="px-2 py-1 bg-background rounded shadow-glow">-</button>
        <input type="range" min="0.5" max="5" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
        <button onClick={() => setZoom(Math.min(5, zoom + 0.5))} className="px-2 py-1 bg-background rounded shadow-glow">+</button>
      </div>
    </div>
  );
}
