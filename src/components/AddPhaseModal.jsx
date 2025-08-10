import { useState } from 'react';

export default function AddPhaseModal({ open, onClose, onSave }) {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#FFD6E0');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-lg p-6 relative w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Add Phase</h2>
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-3 flex gap-2">
          <div>
            <label className="block mb-1 font-semibold">Start Date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} className="p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">End Date</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="p-2 border rounded" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 border-none rounded-full shadow" />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-muted rounded">Cancel</button>
          <button
            onClick={() => {
              if (name && start && end) {
                onSave({ name, start: new Date(start), end: new Date(end), color });
                onClose();
              }
            }}
            className="px-4 py-2 bg-gold text-white rounded shadow-glow font-bold"
            disabled={!name || !start || !end}
          >
            Save Phase
          </button>
        </div>
      </div>
    </div>
  );
}
