import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
export default function Phase({ phase, style, onClick }) {
  const [hover, setHover] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const barRef = useRef(null);
  const days = phase.start && phase.end ? Math.round((phase.end - phase.start) / (1000 * 60 * 60 * 24)) : null;
  return (
    <div
      ref={barRef}
      className="absolute border border-gold rounded px-2 py-2 overflow-hidden cursor-pointer shadow-glow hover:bg-gold/20 transition flex items-center"
      style={{ ...style, background: phase.color || '#FFD6E0', boxShadow: `0 0 12px 2px ${phase.color || '#FFD6E0'}` }}
      onClick={onClick}
      onMouseEnter={e => { setHover(true); setMouse({ x: e.clientX, y: e.clientY }); }}
      onMouseMove={e => { if (hover) setMouse({ x: e.clientX, y: e.clientY }); }}
      onMouseLeave={() => setHover(false)}
    >
      <span className="font-bold mr-2" style={{
        color: '#111',
        fontSize: '0.7em',
        lineHeight: '1.05',
        padding: '2px 6px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.18)',
        fontWeight: 600,
        letterSpacing: '0.01em',
      }}>{phase.title || phase.name}</span>
      {hover && createPortal(
        <div style={{
          position: 'fixed',
          left: mouse.x + 12,
          top: mouse.y - 36,
          background: '#fff',
          color: '#222',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: '6px 12px',
          zIndex: 9999,
          whiteSpace: 'nowrap',
          fontSize: '0.95em',
          pointerEvents: 'none',
        }}>
          <strong>{phase.title || phase.name}</strong><br />
          {days !== null && <span>{days} days</span>}
        </div>, document.body)
      }
    </div>
  );
}
