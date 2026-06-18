import './App.css'
import DevLog from './devlog/DevLog';
import { useRef, useEffect, useState } from 'react';

const TILE = 32;
const PAD = 12;
const RATIO_COLS = 8;
const RATIO_ROWS = 5;

function App() {
  const VERSION = "0.0.0";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [grid, setGrid] = useState({ cols: RATIO_COLS, rows: RATIO_ROWS });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const { width, height } = stage.getBoundingClientRect();
      const availW = width - PAD * 2;
      const availH = height - PAD * 2;
      const maxCols = Math.floor(availW / TILE);
      const maxRows = Math.floor(availH / TILE);
      const k = Math.max(
        1,
        Math.min(Math.floor(maxCols / RATIO_COLS), Math.floor(maxRows / RATIO_ROWS)),
      );
      setGrid({ cols: RATIO_COLS * k, rows: RATIO_ROWS * k });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const bufferW = grid.cols * TILE;
  const bufferH = grid.rows * TILE;

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, bufferW, bufferH);
    ctx.strokeStyle = '#222';
    for (let x = 0; x <= grid.cols; x++) { ctx.beginPath(); ctx.moveTo(x * TILE, 0); ctx.lineTo(x * TILE, bufferH); ctx.stroke(); }
    for (let y = 0; y <= grid.rows; y++) { ctx.beginPath(); ctx.moveTo(0, y * TILE); ctx.lineTo(bufferW, y * TILE); ctx.stroke(); }
  }, [bufferW, bufferH, grid.cols, grid.rows]);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Pokémon:</h1>
          <img src={`logo.png`} alt="Wet-Hot" className="h-20 w-auto" />
        </div>
        <nav className="flex items-center gap-3">
          <DevLog src={`${import.meta.env.BASE_URL}DEVLOG.md`} />
          <a href="https://github.com/DylanLiesenfelt/Pokemon-Wet-Hot" className="text-sm text-neutral-400 transition-colors hover:text-neutral-100">GitHub</a>
          <a href="https://bubbanaut.net" className="text-sm text-neutral-400 transition-colors hover:text-neutral-100">My Site</a>
        </nav>
      </header>

      <div ref={stageRef} className="flex flex-1 items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={bufferW}
          height={bufferH}
          style={{ imageRendering: 'pixelated' }}
          className="bg-black shadow-lg ring-1 ring-neutral-800"
        />
      </div>

      <footer className="flex items-center justify-between border-t border-neutral-800 px-4 py-1 text-xs text-neutral-500">
        <span>VERSION: {VERSION}</span>
        <span>{grid.cols} x {grid.rows} tiles</span>
      </footer>
    </main>
  );
}

export default App;