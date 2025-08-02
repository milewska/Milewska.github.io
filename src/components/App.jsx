import { useState } from 'react';
import Header from './Header.jsx';
import Controls from './Controls.jsx';
import Timeline from './Timeline.jsx';
import PhaseModal from './PhaseModal.jsx';

export default function App() {
  const [phases, setPhases] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState(null);

  const updateTitle = (title) => {
    setPhases((prev) => prev.map((p) => (p === selected ? { ...p, name: title } : p)));
    setSelected((p) => (p ? { ...p, name: title } : p));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Controls setPhases={setPhases} zoom={zoom} setZoom={setZoom} />
      <Timeline phases={phases} zoom={zoom} onPhaseClick={setSelected} />
      {selected && (
        <PhaseModal phase={selected} onClose={() => setSelected(null)} onUpdateTitle={updateTitle} />
      )}
    </div>
  );
}
