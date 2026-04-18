import { describe, it, expect } from 'vitest';
import { getTimeMultiplier, simulateZoneLogic } from '../lib/simulationUtils';

describe('Crowd Simulation Utils', () => {
  it('should return a multiplier within expected range for active match', () => {
    // Test afternoon peak
    const afternoonDate = new Date();
    afternoonDate.setHours(15, 0, 0);
    
    const mult = getTimeMultiplier(true, afternoonDate);
    expect(mult).toBeGreaterThanOrEqual(0.7);
    expect(mult).toBeLessThanOrEqual(0.9);
  });

  it('should return a low multiplier for night without match', () => {
    const nightDate = new Date();
    nightDate.setHours(23, 0, 0);
    
    const mult = getTimeMultiplier(false, nightDate);
    expect(mult).toBeGreaterThanOrEqual(0.02);
    expect(mult).toBeLessThanOrEqual(0.05);
  });

  it('should smoothly transition crowd toward target', () => {
    const zone = {
      id: 'gate-a',
      name: 'Main Gate',
      currentCrowd: 100,
      capacity: 1000
    };
    
    // Low time multiplier means target crowd is low (e.g. 1000 * 0.1 * 1.0 = 100)
    // If current is 500, it should decrease
    const result = simulateZoneLogic(
      { ...zone, currentCrowd: 500 },
      500,
      0.1, // multiplier
      50   // processing rate
    );
    
    expect(result.currentCrowd).toBeLessThan(500);
    expect(result.currentCrowd).toBeGreaterThanOrEqual(100);
  });

  it('should calculate wait minutes correctly', () => {
    const zone = {
      id: 'gate-a',
      name: 'Main Gate',
      currentCrowd: 500,
      capacity: 1000
    };
    
    const rate = 50; // 50 people per minute
    // 500 people / 50 per min = 10 minutes wait
    const result = simulateZoneLogic(zone, 500, 0.5, rate);
    
    // Since noise/lerp might change the count, we just check if it's roughly correct
    const expectedWait = Math.ceil(result.currentCrowd / rate);
    expect(result.estimatedWaitMinutes).toBe(expectedWait);
  });
});
