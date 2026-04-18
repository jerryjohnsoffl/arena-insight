import { useState, useEffect, useCallback, useRef } from 'react';
import { ZoneSimData, getTimeMultiplier, simulateZoneLogic } from '@/lib/simulationUtils';

interface SimulationConfig {
  zones: { id: string; name: string; currentCrowd: number; capacity: number; estimatedWaitMinutes: number }[];
  stadiumCapacity: number;
  isActiveMatch: boolean;
  getProcessingRate: (zoneId: string) => number;
}

export function useCrowdSimulation({ zones, stadiumCapacity, isActiveMatch, getProcessingRate }: SimulationConfig) {
  const [simulatedZones, setSimulatedZones] = useState<ZoneSimData[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSimulation = useCallback(() => {
    if (intervalRef.current) return;
    setIsSimulating(true);

    const runSim = (prevData?: ZoneSimData[]) => {
      const timeMultiplier = getTimeMultiplier(isActiveMatch);
      return zones.map(zone => {
        const prevCrowd = prevData?.find(p => p.id === zone.id)?.currentCrowd ?? zone.currentCrowd;
        return simulateZoneLogic(zone, prevCrowd, timeMultiplier, getProcessingRate(zone.id));
      });
    };

    setSimulatedZones(runSim());

    intervalRef.current = setInterval(() => {
      setSimulatedZones(prev => runSim(prev));
    }, 5000);
  }, [zones, isActiveMatch, getProcessingRate]);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
  }, []);

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

