import React from 'react';
import { Activity, Flame } from 'lucide-react';
import { Zone } from './StadiumMap';

export function CrowdHeatmap({ zones }: { zones: Zone[] }) {
  // Sort zones by crowdedness to show bottlenecks at the top
  const sortedZones = [...zones].sort((a, b) => 
    (b.currentCrowd / b.capacity) - (a.currentCrowd / a.capacity)
  );

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
          <Flame size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-50">Thermal Heatmap</h2>
          <p className="text-xs text-zinc-400">Live zone congestion levels</p>
        </div>
      </div>
      
      <div className="space-y-6 flex-1">
        {sortedZones.map((zone) => {
          const rawPercentage = (zone.currentCrowd / zone.capacity) * 100;
          const percentage = Math.min(100, Math.max(0, rawPercentage));
          
          let gradientClass = "from-emerald-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
          let textColor = "text-emerald-400";
          let statusText = "Smooth";
          
          if (percentage > 50) {
            gradientClass = "from-amber-400 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.3)]";
            textColor = "text-amber-400";
            statusText = "Moderate";
          }
          if (percentage > 85) {
            gradientClass = "from-rose-500 to-rose-700 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse";
            textColor = "text-rose-500";
            statusText = "Severe";
          }
          
          return (
            <div key={zone.id} className="group cursor-default">
              <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-200">{zone.name}</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${textColor}`}>{statusText}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">{Math.round(percentage)}%</span>
                  <span className="text-xs font-medium text-zinc-500 ml-1">({zone.currentCrowd})</span>
                </div>
              </div>
              
              <div className="w-full h-4 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 relative">
                {/* Background track ticks for visuals */}
                <div className="absolute inset-0 flex justify-between px-2 opacity-20 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-full w-[1px] bg-white"></div>
                  ))}
                </div>
                
                {/* The glowing progress bar */}
                <div 
                  className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${gradientClass}`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className="w-full h-full bg-white/20"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> &lt;50%</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> 50-85%</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> &gt;85%</div>
      </div>
    </div>
  );
}
