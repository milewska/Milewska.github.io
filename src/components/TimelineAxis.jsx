export default function TimelineAxis({ rangeStart, rangeEnd, width, top }) {
  const msPerDay = 86400000;
  const totalDays = (rangeEnd - rangeStart) / msPerDay;
  const startYear = rangeStart.getFullYear();
  const endYear = rangeEnd.getFullYear();
  const years = [];
  for (let y = startYear; y <= endYear; y++) years.push(y);

  return (
    <div className="absolute left-0 w-full border-t border-muted" style={{ top }}>
      {years.map((y) => {
        const pos = ((new Date(y, 0, 1) - rangeStart) / msPerDay) / totalDays * width;
        return (
          <div key={y} className="absolute border-l border-muted text-xs text-muted" style={{ left: pos }}>
            <span className="absolute -bottom-5 -translate-x-1/2">{y}</span>
          </div>
        );
      })}
    </div>
  );
}
