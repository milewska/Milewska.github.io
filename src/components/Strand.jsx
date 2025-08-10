import Phase from './Phase.jsx';

export default function Strand({ name, phases, rangeStart, rangeEnd, top, onPhaseClick, width }) {
  const msPerDay = 86400000;
  const totalDays = (rangeEnd - rangeStart) / msPerDay;
  // If timeline calculations are invalid, skip rendering
  if (!rangeStart || !rangeEnd || isNaN(totalDays) || !isFinite(totalDays) || !width || isNaN(width) || !isFinite(width)) {
    return null;
  }

  // Sort by duration (longest first), then by start date
  const sorted = [...phases].sort((a, b) => {
    const durA = a.end && a.start ? a.end - a.start : 0;
    const durB = b.end && b.start ? b.end - b.start : 0;
    if (durB !== durA) return durB - durA;
    return a.start - b.start;
  });
  const lanes = [];
  const items = sorted.map((p) => {
    let lane = 0;
    while (lane < lanes.length && p.start < lanes[lane]) lane++;
    lanes[lane] = p.end;
    return { ...p, lane };
  });

  const laneHeight = 40;

  // Make bars taller
  const barHeight = 32;
  return (
    <div className="absolute left-0" style={{ top }}>
      <div className="text-muted mb-1">{name}</div>
      <div className="relative" style={{ height: laneHeight * (lanes.length + 1), overflow: 'visible' }}>
        {items.map((p, idx) => {
          if (!p.start || !p.end || !(p.start instanceof Date) || isNaN(p.start) || !(p.end instanceof Date) || isNaN(p.end)) return null;
          const left = ((p.start - rangeStart) / msPerDay) / totalDays * width;
          const w = ((p.end - p.start) / msPerDay) / totalDays * width;
          if (isNaN(left) || !isFinite(left) || isNaN(w) || !isFinite(w)) return null;
          const firstCol = Object.values(p)[0];
          const safeFirstCol = typeof firstCol === 'object' ? JSON.stringify(firstCol) : String(firstCol);
          const key = safeFirstCol && p.start ? `${safeFirstCol}${p.start}` : `phase-${idx}`;
          // Pass barHeight and color to Phase
          return (
            <Phase key={key} phase={p} style={{ left, width: w, top: p.lane * laneHeight, height: barHeight }} onClick={() => onPhaseClick(p)} />
          );
        })}
      </div>
    </div>
  );
}
