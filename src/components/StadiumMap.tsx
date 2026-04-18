"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Map, Footprints, Clock, X } from 'lucide-react';

// Dynamically import the map to prevent Leaflet's 'window is not defined' SSR error
const RouteMap = dynamic(() => import('./RouteMap'), {
  ssr: false,
  loading: () => <div className="w-full h-80 rounded-2xl bg-zinc-900 border-zinc-800 border border-zinc-800 animate-pulse mt-4"></div>
});

import { Stadium } from '@/data/stadiums';

export interface Zone {
  id: string;
  name: string;
  currentCrowd: number;
  capacity: number;
  estimatedWaitMinutes: number;
}

export function StadiumMap({ zones, stadium }: { zones: Zone[], stadium?: Stadium }) {
  const [showMap, setShowMap] = useState(false);

  const getCrowdColor = (current: number, capacity: number) => {
    const ratio = current / capacity;
    if (ratio >= 0.8) return 'bg-red-500/20 text-red-500 border-red-500/50';
    if (ratio >= 0.5) return 'bg-amber-500/20 text-amber-500 border-amber-500/50';
    return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50';
  };

  // Identify the best gate based on smallest wait time
  const gates = zones.filter(z => z.id.startsWith('gate-'));
  const bestGate = [...gates].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes)[0];
  const bestGateName = bestGate?.name || 'Gate C';

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Map className="text-zinc-50" size={24} />
        <h2 className="text-xl font-bold text-zinc-50">Live Venue Status</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className={`flex flex-col p-5 rounded-2xl border ${getCrowdColor(zone.currentCrowd, zone.capacity)} transition-colors`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-lg">{zone.name}</span>
              <span className="text-sm font-medium opacity-80">{Math.round((zone.currentCrowd/zone.capacity)*100)}% Full</span>
            </div>
            
            <div className="flex gap-4 mt-auto">
              <div className="flex items-center gap-1.5 text-sm">
                <Footprints size={16} />
                <span>{zone.currentCrowd} people</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Clock size={16} />
                <span>{zone.estimatedWaitMinutes} min wait</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!showMap ? (
        <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <span>Smart recommendation: Head to <strong>{bestGateName}</strong> for the fastest entry right now.</span>
          <button 
            onClick={() => setShowMap(true)}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-zinc-50 rounded-full font-medium transition-colors whitespace-nowrap shadow-lg shadow-indigo-500/20"
          >
            Route Me
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between p-4 rounded-t-xl bg-indigo-500 text-zinc-50 font-medium">
            <span>Routing Map...</span>
            <button onClick={() => setShowMap(false)} className="hover:bg-indigo-600 p-1 rounded-full text-zinc-50 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-1 bg-zinc-800 rounded-b-xl border-x border-b border-zinc-800 shadow-xl">
            <RouteMap zones={zones} stadium={stadium} />
          </div>
        </div>
      )}
    </div>
  );
}

