import { useState } from 'react';
import Header from './Header.jsx';
import Controls from './Controls.jsx';
import Timeline from './Timeline.jsx';
import PhaseModal from './PhaseModal.jsx';
import AddPhaseModal from './AddPhaseModal.jsx';

export default function App() {
  const [phases, setPhases] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState(null);
  const [userPhases, setUserPhases] = useState([]);
  const [showAddPhase, setShowAddPhase] = useState(false);

  const updateTitle = (title) => {
    setPhases((prev) => prev.map((p) => (p === selected ? { ...p, name: title } : p)));
    setSelected((p) => (p ? { ...p, name: title } : p));
  };

  // Helper: convert phase dates to pixel positions for overlay lines
  const getPxForDate = (date) => {
    // Example: timeline starts at minDate, ends at maxDate, width = 1000px
    // You should replace this with your actual timeline logic
    const minDate = new Date('2020-01-01');
    const maxDate = new Date('2025-12-31');
    const timelineWidth = 1000;
    const d = new Date(date);
    const percent = (d - minDate) / (maxDate - minDate);
    return percent * timelineWidth;
  };

  // Add pixel positions to userPhases for overlay rendering
  const userPhasesWithPx = userPhases.map(phase => ({
    ...phase,
    startPx: getPxForDate(phase.start),
    endPx: getPxForDate(phase.end)
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex items-center gap-4 px-4 pt-4">
        <button
          className="px-4 py-2 bg-gold text-white rounded shadow-glow font-bold"
          onClick={() => setShowAddPhase(true)}
        >
          Add Phase
        </button>
        {userPhases.length > 0 && (
          <div className="flex gap-2">
            {userPhases.map((phase, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full cursor-pointer font-semibold"
                style={{ background: phase.color, color: '#222', border: '2px solid #fff', boxShadow: `0 0 8px 2px ${phase.color}` }}
                onClick={() => setSelected(phase)}
                title={phase.name}
              >
                {phase.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <Controls setPhases={setPhases} zoom={zoom} setZoom={setZoom} />
      <Timeline
        phases={phases}
        zoom={zoom}
        onPhaseClick={setSelected}
        userPhasesWithPx={userPhasesWithPx}
      />
      {showAddPhase && (
        <AddPhaseModal
          open={showAddPhase}
          onClose={() => setShowAddPhase(false)}
          onSave={(phase) => setUserPhases((prev) => [...prev, phase])}
        />
      )}
      {selected && (
        <PhaseModal
          phase={selected}
          onClose={() => setSelected(null)}
          onUpdateTitle={updateTitle}
          bars={phases}
        />
      )}
    </div>
  );
}
