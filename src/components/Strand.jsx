import Phase from './Phase.jsx';

export default function Strand({ name, phases, rangeStart, rangeEnd, top, onPhaseClick, width }) {
  const msPerDay = 86400000;
  const totalDays = (rangeEnd - rangeStart) / msPerDay;

  const sorted = [...phases].sort((a, b) => a.start - b.start);
  const lanes = [];
  const items = sorted.map((p) => {
    let lane = 0;
    while (lane < lanes.length && p.start < lanes[lane]) lane++;
    lanes[lane] = p.end;
    return { ...p, lane };
  });

  const laneHeight = 40;

  return (
    <div className="absolute left-0" style={{ top }}>
      <div className="text-muted mb-1">{name}</div>
      <div className="relative" style={{ height: laneHeight * (lanes.length + 1) }}>
        {items.map((p) => {
          const left = ((p.start - rangeStart) / msPerDay) / totalDays * width;
          const w = ((p.end - p.start) / msPerDay) / totalDays * width;
          return (
            <Phase key={p.name + p.start} phase={p} style={{ left, width: w, top: p.lane * laneHeight }} onClick={() => onPhaseClick(p)} />
          );
        })}
      </div>
    </div>
  );
}
