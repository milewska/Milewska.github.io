import Strand from './Strand.jsx';
import TimelineAxis from './TimelineAxis.jsx';

export default function Timeline({ phases, zoom, onPhaseClick }) {
  if (!phases.length) {
    return <div className="p-4 text-muted">Upload a CSV to visualize your life.</div>;
  }

  // Filter out phases with invalid or missing start/end dates
  const validPhases = phases.filter(p => p.start && p.end && p.start instanceof Date && !isNaN(p.start) && p.end instanceof Date && !isNaN(p.end));
  if (!validPhases.length) {
    return <div className="p-4 text-muted">No valid records to display. Check your data for missing or invalid dates.</div>;
  }

  const start = new Date(Math.min(...validPhases.map((p) => p.start)));
  const end = new Date(Math.max(...validPhases.map((p) => p.end)));
  const msPerDay = 86400000;
  const totalDays = (end - start) / msPerDay;
  const width = totalDays * zoom * 2;

  // If timeline calculations are invalid, skip rendering
  if (!start || !end || isNaN(totalDays) || !isFinite(totalDays) || !width || isNaN(width) || !isFinite(width)) {
    return <div className="p-4 text-muted">Timeline cannot be displayed due to invalid date range or width.</div>;
  }

  const strands = validPhases.reduce((acc, p) => {
    acc[p.strand] = acc[p.strand] || [];
    acc[p.strand].push(p);
    return acc;
  }, {});

  // ...existing code...

  // Render user phases overlays at the top
  // Expect prop: userPhasesWithPx
  return (
    <div className="overflow-x-auto text-text" style={{ height: '400px' }}>
      <div className="relative" style={{ width }}>
        {/* User phase overlays */}
        {Array.isArray(arguments[0]?.userPhasesWithPx) && arguments[0].userPhasesWithPx.map((phase, idx) => (
          <>
            <div key={idx} className="absolute left-0 right-0" style={{ top: 0, zIndex: 20 }}>
              <div
                className="flex items-center justify-center gap-2"
                style={{ position: 'relative', height: '32px' }}
              >
                <span
                  className="px-4 py-1 rounded-full font-bold shadow-glow"
                  style={{ background: phase.color, color: '#222', border: '2px solid #fff', boxShadow: `0 0 8px 2px ${phase.color}` }}
                >
                  {phase.name}
                </span>
              </div>
              {/* Vertical lines for start and end dates */}
              <div
                className="absolute"
                style={{ left: `${phase.startPx}px`, top: '32px', bottom: 0, width: '2px', background: phase.color, zIndex: 10 }}
              />
              <div
                className="absolute"
                style={{ left: `${phase.endPx}px`, top: '32px', bottom: 0, width: '2px', background: phase.color, zIndex: 10 }}
              />
            </div>
          </>
        ))}
        {/* Timeline bars */}
        {Object.entries(strands).map(([name, phs], idx) => (
          <Strand key={name} name={name} phases={phs} rangeStart={start} rangeEnd={end} top={idx * 100} onPhaseClick={onPhaseClick} width={width} />
        ))}
        <TimelineAxis rangeStart={start} rangeEnd={end} width={width} top={Object.keys(strands).length * 100} />
      </div>
    </div>
  );
}
