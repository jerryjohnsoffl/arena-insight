export interface StadiumZone {
  id: string;
  name: string;
  capacity: number;
  type: 'gate' | 'food' | 'parking' | 'vip' | 'medical';
  processingRate: number;
}

const stadiumZonesMap: Record<string, StadiumZone[]> = {
  'stadium-a': [
    { id: 'gate-1', name: 'Gate 1', capacity: 15000, type: 'gate', processingRate: 120 },
    { id: 'gate-2', name: 'Gate 2', capacity: 15000, type: 'gate', processingRate: 120 },
    { id: 'gate-3', name: 'Gate 3', capacity: 10000, type: 'gate', processingRate: 80 },
    { id: 'gate-4', name: 'Gate 4', capacity: 10000, type: 'gate', processingRate: 80 },
    { id: 'food-north', name: 'North Snacks', capacity: 2000, type: 'food', processingRate: 30 },
    { id: 'food-south', name: 'South Cafe', capacity: 3000, type: 'food', processingRate: 40 },
    { id: 'section-a19', name: 'Section A19', capacity: 450, type: 'gate', processingRate: 10 },
  ],
};

export function getStadiumZones(stadiumId: string, stadiumCapacity: number): StadiumZone[] {
  if (stadiumZonesMap[stadiumId]) return stadiumZonesMap[stadiumId];
  return [
    { id: 'gate-1', name: 'Main Gate', capacity: Math.round(stadiumCapacity * 0.1), type: 'gate', processingRate: 100 },
  ];
}
