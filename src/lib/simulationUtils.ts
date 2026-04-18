export interface ZoneSimData {
  id: string;
  currentCrowd: number;
  capacity: number;
  estimatedWaitMinutes: number;
}

/**
 * Intelligent crowd simulation logic.
 */
export const getTimeMultiplier = (isActiveMatch: boolean, date: Date = new Date()) => {
  const hour = date.getHours();
  
  if (isActiveMatch) {
    if (hour >= 9 && hour < 14) return 0.6 + Math.random() * 0.2;
    if (hour >= 14 && hour < 18) return 0.7 + Math.random() * 0.2;
    if (hour >= 18 && hour < 22) return 0.8 + Math.random() * 0.15;
    return 0.2 + Math.random() * 0.1;
  }

  if (hour >= 6 && hour < 10) return 0.05 + Math.random() * 0.05;
  if (hour >= 10 && hour < 14) return 0.08 + Math.random() * 0.07;
  if (hour >= 14 && hour < 18) return 0.1 + Math.random() * 0.1;
  if (hour >= 18 && hour < 22) return 0.12 + Math.random() * 0.08;
  return 0.02 + Math.random() * 0.03;
};

export const simulateZoneLogic = (
  zone: { id: string, name: string, currentCrowd: number, capacity: number },
  prevCrowd: number,
  timeMultiplier: number,
  processingRate: number
): ZoneSimData => {
  const zoneWeights: Record<string, number> = {
    'gate-1': 1.0,
    'gate-2': 0.8,
    'gate-3': 0.7,
    'gate-a': 1.0,
    'gate-b': 0.7,
    'gate-c': 0.5,
    'food-east': 0.85,
    'food-north': 0.75,
    'food-south': 0.70,
  };
  
  const weight = zoneWeights[zone.id] || 0.6;
  const targetCrowd = Math.round(zone.capacity * timeMultiplier * weight);
  
  // Smooth transition
  const lerpSpeed = 0.15 + Math.random() * 0.15;
  const smoothedCrowd = Math.round(prevCrowd + (targetCrowd - prevCrowd) * lerpSpeed);
  
  // Noise
  const noise = Math.round(smoothedCrowd * (Math.random() * 0.06 - 0.03));
  const finalCrowd = Math.max(0, Math.min(zone.capacity, smoothedCrowd + noise));
  
  const waitMinutes = processingRate > 0 ? Math.ceil(finalCrowd / processingRate) : 0;

  return {
    id: zone.id,
    currentCrowd: finalCrowd,
    capacity: zone.capacity,
    estimatedWaitMinutes: waitMinutes,
  };
};
