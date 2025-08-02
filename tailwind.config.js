/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#111827',
        panel: '#1f2937',
        gold: '#FBBF24',
        text: '#f3f4f6',
        muted: '#9ca3af',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px rgba(251,191,36,0.6)',
      },
      backgroundImage: {
        geometry: "url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 100 100\\'%3E%3Cpath fill=\\'none\\' stroke=\\'%23333\\' stroke-width=\\'0.5\\' d=\\'M0 50h100M50 0v100M0 0l100 100M100 0L0 100\\'/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
