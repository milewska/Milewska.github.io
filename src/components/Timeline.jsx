import Strand from './Strand.jsx';
import TimelineAxis from './TimelineAxis.jsx';

export default function Timeline({ phases, zoom, onPhaseClick }) {
  if (!phases.length) {
    return <div className="p-4 text-muted">Upload a CSV to visualize your life.</div>;
  }

  const start = new Date(Math.min(...phases.map((p) => p.start)));
  const end = new Date(Math.max(...phases.map((p) => p.end)));
  const msPerDay = 86400000;
  const totalDays = (end - start) / msPerDay;
  const width = totalDays * zoom * 2;

  const strands = phases.reduce((acc, p) => {
    acc[p.strand] = acc[p.strand] || [];
    acc[p.strand].push(p);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto text-text" style={{ height: '400px' }}>
      <div className="relative" style={{ width }}>
        {Object.entries(strands).map(([name, phs], idx) => (
          <Strand key={name} name={name} phases={phs} rangeStart={start} rangeEnd={end} top={idx * 100} onPhaseClick={onPhaseClick} width={width} />
        ))}
        <TimelineAxis rangeStart={start} rangeEnd={end} width={width} top={Object.keys(strands).length * 100} />
      </div>
    </div>
  );
}
