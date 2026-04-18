import { useState, useEffect, useCallback, useRef } from 'react';

interface ZoneSimData {
  id: string;
  currentCrowd: number;
  capacity: number;
  estimatedWaitMinutes: number;
}

interface SimulationConfig {
  zones: { id: string; name: string; currentCrowd: number; capacity: number; estimatedWaitMinutes: number }[];
  stadiumCapacity: number;
  isActiveMatch: boolean;
  getProcessingRate: (zoneId: string) => number;
}

/**
 * Intelligent crowd simulation engine.
 * 
 * Generates realistic crowd fluctuations based on:
 * - Time of day (morning = low, afternoon = building, evening = peak for cricket)
 * - Whether an active match is happening (from the cricket data API)
 * - Stadium capacity (scales proportionally)
 * - Per-zone random drift for organic-looking data
 * 
 * The simulation updates every 5 seconds with smooth transitions.
 */
export function useCrowdSimulation({ zones, stadiumCapacity, isActiveMatch, getProcessingRate }: SimulationConfig) {
  const [simulatedZones, setSimulatedZones] = useState<ZoneSimData[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Time-of-day crowd multiplier (IST-aware)
  const getTimeMultiplier = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    
    if (isActiveMatch) {
      // During a live match: crowd is always high
      if (hour >= 9 && hour < 14) return 0.6 + Math.random() * 0.2;   // Morning match
      if (hour >= 14 && hour < 18) return 0.7 + Math.random() * 0.2;  // Afternoon match
      if (hour >= 18 && hour < 22) return 0.8 + Math.random() * 0.15; // Evening match (peak)
      return 0.2 + Math.random() * 0.1; // Late night / early morning
    }

    // No active match: lower baseline crowd (maintenance / practice / tour)
    if (hour >= 6 && hour < 10) return 0.05 + Math.random() * 0.05;
    if (hour >= 10 && hour < 14) return 0.08 + Math.random() * 0.07;
    if (hour >= 14 && hour < 18) return 0.1 + Math.random() * 0.1;
    if (hour >= 18 && hour < 22) return 0.12 + Math.random() * 0.08;
    return 0.02 + Math.random() * 0.03;
  }, [isActiveMatch]);

  // Generate crowd for a specific zone
  const simulateZone = useCallback((zone: typeof zones[0], prevCrowd: number): ZoneSimData => {
    const timeMultiplier = getTimeMultiplier();
    
    // Each zone has a different "popularity" weight
    const zoneWeights: Record<string, number> = {
      'gate-a': 1.0,      // Main gate = busiest
      'gate-b': 0.7,      // Secondary gate
      'gate-c': 0.5,      // Smallest gate
      'food-east': 0.85,  // Food court is always busy
    };
    const weight = zoneWeights[zone.id] || 0.6;

    // Target crowd for this tick
    const targetCrowd = Math.round(zone.capacity * timeMultiplier * weight);
    
    // Smooth transition: move 15-30% toward target each tick (avoids jarring jumps)
    const lerpSpeed = 0.15 + Math.random() * 0.15;
    const smoothedCrowd = Math.round(prevCrowd + (targetCrowd - prevCrowd) * lerpSpeed);
    
    // Add micro-noise for realism (±3%)
    const noise = Math.round(smoothedCrowd * (Math.random() * 0.06 - 0.03));
    const finalCrowd = Math.max(0, Math.min(zone.capacity, smoothedCrowd + noise));

    const rate = getProcessingRate(zone.id);
    const waitMinutes = rate > 0 ? Math.ceil(finalCrowd / rate) : 0;

    return {
      id: zone.id,
      currentCrowd: finalCrowd,
      capacity: zone.capacity,
      estimatedWaitMinutes: waitMinutes,
    };
  }, [getTimeMultiplier, getProcessingRate]);

  const startSimulation = useCallback(() => {
    if (intervalRef.current) return; // Already running
    setIsSimulating(true);

    // Initial seed
    setSimulatedZones(zones.map(z => simulateZone(z, z.currentCrowd)));

    intervalRef.current = setInterval(() => {
      setSimulatedZones(prev => {
        return zones.map(zone => {
          const prevData = prev.find(p => p.id === zone.id);
          return simulateZone(zone, prevData?.currentCrowd ?? 0);
        });
      });
    }, 5000); // Update every 5 seconds
  }, [zones, simulateZone]);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    simulatedZones,
    isSimulating,
    startSimulation,
    stopSimulation,
  };
}
