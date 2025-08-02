export default function Phase({ phase, style, onClick }) {
  return (
    <div
      className="absolute bg-panel border border-gold rounded px-2 py-1 overflow-hidden cursor-pointer shadow-glow hover:bg-gold/20 transition"
      style={style}
      onClick={onClick}
    >
      {phase.name}
    </div>
  );
}
