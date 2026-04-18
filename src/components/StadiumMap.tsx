"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Map, Footprints, Clock, Activity } from 'lucide-react';

interface Pin {
  x: number;
  y: number;
  color: string;
  label: string;
  lines: string[];
}

export interface Zone {
  id: string;
  name: string;
  currentCrowd: number;
  capacity: number;
  estimatedWaitMinutes: number;
}

const pins: Pin[] = [
  { x: 0.205, y: 0.127, color: '#E24B4A', label: 'Entry Gate 4 — NE', lines: ['Status: Potential bottleneck', 'Checkpoints: 4 open', 'Access: General'] },
  { x: 0.205, y: 0.873, color: '#E24B4A', label: 'Entry Gate 4 — SW', lines: ['Status: High traffic', 'Access: VIP & General'] },
  { x: 0.785, y: 0.127, color: '#EF9F27', label: 'Level 2 Concourse Junction', lines: ['Type: High traffic crossing', 'Status: Congested'] },
  { x: 0.785, y: 0.873, color: '#EF9F27', label: 'South Concourse Cafe', lines: ['Wait time: ~12 mins', 'Items: Hotdogs, Beer, Soda'] },
  { x: 0.155, y: 0.48, color: '#EF9F27', label: 'North Concourse Snacks', lines: ['Wait time: ~5 mins', 'Items: Coffee, Sandwiches'] },
  { x: 0.14, y: 0.62, color: '#1D9E75', label: 'Section A19', lines: ['Seats: 450 total', 'Density: ~4 people/m²', 'Status: Peak capacity'] },
  { x: 0.86, y: 0.65, color: '#1D9E75', label: 'Section J17/H18', lines: ['Seats: 600 total', 'Flow: 1.5 ppl/sec/m', 'Status: Moving'] },
  { x: 0.87, y: 0.55, color: '#378ADD', label: 'Emergency Egress Paths', lines: ['Green arrows active', 'All exits: Clear'] },
];

export function StadiumMap({ zones }: { zones: Zone[] }) {
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-zinc-50 flex items-center gap-2">
              <Map className="text-indigo-400" /> Interactive Crowd Analysis
            </h2>
            <p className="text-zinc-400 text-sm mt-1">Hover over markers to inspect gates, concessions, and crowd density zones</p>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-tighter flex items-center gap-1">
              <Activity size={12} className="animate-pulse" /> Live Monitoring
            </div>
          </div>
        </header>

        <div
          className="relative w-full overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/50"
          ref={mapRef}
          onMouseMove={handleMouseMove}
        >
          <svg viewBox="0 0 800 520" className="w-full h-auto block select-none">
            {/* Background */}
            <rect width="800" height="520" fill="#09090b" rx="8" />

            {/* Pitch */}
            <ellipse cx="400" cy="260" rx="195" ry="145" fill="#14532d" fillOpacity="0.4" />
            <ellipse cx="400" cy="260" rx="195" ry="145" fill="none" stroke="#166534" strokeWidth="0.8" />
            <rect x="270" y="180" width="260" height="160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="400" cy="260" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="400" cy="260" r="2" fill="rgba(255,255,255,0.2)" />
            <line x1="400" y1="180" x2="400" y2="340" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <rect x="270" y="235" width="20" height="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <rect x="510" y="235" width="20" height="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <rect x="270" y="210" width="70" height="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <rect x="460" y="210" width="70" height="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

            {/* Stand shell */}
            <ellipse cx="400" cy="260" rx="370" ry="240" fill="#09090b" stroke="#27272a" strokeWidth="0.8" />
            <ellipse cx="400" cy="260" rx="230" ry="170" fill="none" stroke="#27272a" strokeWidth="0.5" />

            {/* Seating tier rings */}
            {[250, 270, 290, 310, 330, 350].map((rx, i) => (
              <ellipse key={i} cx="400" cy="260" rx={rx} ry={rx * 0.73} fill="none" stroke="#18181b" strokeWidth="0.5" />
            ))}

            {/* Concourse walkway */}
            <ellipse cx="400" cy="260" rx="360" ry="238" fill="none" stroke="#3f3f46" strokeWidth="1" />

            {/* Radial dividers */}
            {[0, 180, 90, 270, 45, 135, 225, 315].map(angle => (
              <line
                key={angle}
                x1={400 + Math.cos(angle * Math.PI / 180) * 230}
                y1={260 + Math.sin(angle * Math.PI / 180) * 170}
                x2={400 + Math.cos(angle * Math.PI / 180) * 370}
                y2={260 + Math.sin(angle * Math.PI / 180) * 240}
                stroke="#27272a" strokeWidth="0.5"
              />
            ))}

            {/* Gate boxes */}
            <g className="text-zinc-600 font-medium">
              <rect x="375" y="18" width="50" height="24" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="0.8" />
              <text x="400" y="35" textAnchor="middle" fontSize="10" fill="currentColor">NORTH</text>

              <rect x="375" y="478" width="50" height="24" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="0.8" />
              <text x="400" y="495" textAnchor="middle" fontSize="10" fill="currentColor">SOUTH</text>

              <rect x="28" y="247" width="24" height="26" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="0.8" />
              <text x="40" y="264" textAnchor="middle" fontSize="9" fill="currentColor">W</text>

              <rect x="748" y="247" width="24" height="26" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="0.8" />
              <text x="760" y="264" textAnchor="middle" fontSize="9" fill="currentColor">E</text>
            </g>

            {/* Corner gates */}
            {[
              { x: 155, y: 58, label: 'Gate 4' },
              { x: 609, y: 58, label: 'Gate 1' },
              { x: 155, y: 442, label: 'Gate 3' },
              { x: 609, y: 442, label: 'Gate 2' },
            ].map((g, i) => (
              <g key={i}>
                <rect x={g.x} y={g.y} width="36" height="20" rx="4" fill="#18181b" stroke="#27272a" strokeWidth="0.8" />
                <text x={g.x + 18} y={g.y + 13} textAnchor="middle" fontSize="9" fill="#71717a">{g.label}</text>
              </g>
            ))}

            {/* Section labels */}
            <text x="400" y="110" textAnchor="middle" fontSize="11" fill="#3f3f46">A20  A28  B40  E10  D19  F18</text>
            <text x="400" y="415" textAnchor="middle" fontSize="11" fill="#3f3f46">A1  A2  A3  A4  F7  F2  F9</text>
          </svg>

          {/* Pins Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {pins.map((p, i) => (
              <div
                key={i}
                className="absolute w-[22px] h-[22px] -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto group"
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
                onMouseEnter={() => setActivePin(p)}
                onMouseLeave={() => setActivePin(null)}
              >
                <div className="relative flex items-center justify-center w-full h-full">
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: p.color }}
                  />
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {activePin && (
            <div
              className="absolute z-50 pointer-events-none transition-all duration-200"
              style={{
                left: mousePos.x + 16,
                top: mousePos.y - 55
              }}
            >
              <div className="bg-zinc-900/95 border border-zinc-700 rounded-xl p-4 min-w-[200px] shadow-2xl backdrop-blur-md">
                <strong className="block text-zinc-50 font-bold mb-2 text-sm uppercase tracking-wide">
                  {activePin.label}
                </strong>
                <div className="flex flex-col gap-1">
                  {activePin.lines.map((line, i) => (
                    <span key={i} className="text-xs text-zinc-400 font-medium">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-zinc-800/50">
          {[
            { color: '#E24B4A', text: 'Entry gates (bottleneck)' },
            { color: '#EF9F27', text: 'High traffic / concessions' },
            { color: '#1D9E75', text: 'Crowd density zones' },
            { color: '#378ADD', text: 'Emergency egress' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Live Zone Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-lg hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-zinc-50 font-bold text-lg">{zone.name}</h3>
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-black">Metrics Active</p>
              </div>
              <div className={`p-2 rounded-lg ${zone.estimatedWaitMinutes > 10 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <Activity size={16} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-medium">
                  <span>Occupancy</span>
                  <span>{Math.round((zone.currentCrowd / zone.capacity) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${zone.currentCrowd / zone.capacity > 0.8 ? 'bg-red-500' : 'bg-indigo-500'}`}
                    style={{ width: `${(zone.currentCrowd / zone.capacity) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock size={14} />
                  <span className="text-sm font-bold text-zinc-300">{zone.estimatedWaitMinutes}m wait</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Footprints size={14} />
                  <span className="text-sm font-bold text-zinc-300">{zone.currentCrowd}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
