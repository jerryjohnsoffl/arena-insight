export interface StadiumZone {
  id: string;
  name: string;
  capacity: number;
  type: 'gate' | 'food' | 'parking' | 'vip' | 'medical';
  processingRate: number; // people processed per minute
}

/**
 * Stadium-specific zone/gate configurations.
 * Each stadium has its own unique set of entry gates, food courts,
 * VIP entrances, and other zones with realistic capacities.
 *
 * Stadiums not listed here will use a generated default set.
 */
const stadiumZonesMap: Record<string, StadiumZone[]> = {

  // --- GUJARAT ---
  'narendra-modi-ahmedabad': [
    { id: 'gate-1', name: 'Gate 1 – North Entry', capacity: 8000, type: 'gate', processingRate: 60 },
    { id: 'gate-2', name: 'Gate 2 – East Pavilion', capacity: 6000, type: 'gate', processingRate: 50 },
    { id: 'gate-3', name: 'Gate 3 – South Entry', capacity: 7000, type: 'gate', processingRate: 55 },
    { id: 'gate-4', name: 'Gate 4 – West Stand', capacity: 6500, type: 'gate', processingRate: 50 },
    { id: 'gate-5', name: 'Gate 5 – Club House', capacity: 3000, type: 'vip', processingRate: 25 },
    { id: 'food-north', name: 'Food Court North', capacity: 2000, type: 'food', processingRate: 20 },
    { id: 'food-south', name: 'Food Court South', capacity: 1800, type: 'food', processingRate: 18 },
  ],

  'sca-stadium-rajkot': [
    { id: 'gate-a', name: 'Main Gate A', capacity: 2000, type: 'gate', processingRate: 35 },
    { id: 'gate-b', name: 'Gate B – East', capacity: 1500, type: 'gate', processingRate: 30 },
    { id: 'gate-c', name: 'Gate C – Members', capacity: 800, type: 'vip', processingRate: 20 },
    { id: 'food-1', name: 'Food Stall Area', capacity: 600, type: 'food', processingRate: 12 },
  ],

  // --- WEST BENGAL ---
  'salt-lake-kolkata': [
    { id: 'gate-1', name: 'Gate 1 – Main Entrance', capacity: 5000, type: 'gate', processingRate: 50 },
    { id: 'gate-2', name: 'Gate 2 – North Stand', capacity: 4000, type: 'gate', processingRate: 45 },
    { id: 'gate-3', name: 'Gate 3 – South Curve', capacity: 4500, type: 'gate', processingRate: 45 },
    { id: 'gate-4', name: 'Gate 4 – East Gallery', capacity: 3500, type: 'gate', processingRate: 40 },
    { id: 'vip-lounge', name: 'VIP Lounge Entry', capacity: 1500, type: 'vip', processingRate: 20 },
    { id: 'food-east', name: 'Food Court East', capacity: 1200, type: 'food', processingRate: 15 },
  ],

  'eden-gardens-kolkata': [
    { id: 'gate-a', name: 'Gate A – B.C. Roy End', capacity: 4000, type: 'gate', processingRate: 45 },
    { id: 'gate-b', name: 'Gate B – High Court End', capacity: 3500, type: 'gate', processingRate: 40 },
    { id: 'gate-c', name: 'Gate C – Ranji Stand', capacity: 3000, type: 'gate', processingRate: 35 },
    { id: 'gate-d', name: 'Gate D – Club House', capacity: 2000, type: 'vip', processingRate: 25 },
    { id: 'food-court', name: 'Central Food Court', capacity: 1500, type: 'food', processingRate: 18 },
  ],

  // --- DELHI ---
  'jln-delhi': [
    { id: 'gate-1', name: 'Gate 1 – Lodhi Road', capacity: 3500, type: 'gate', processingRate: 40 },
    { id: 'gate-2', name: 'Gate 2 – South End', capacity: 3000, type: 'gate', processingRate: 35 },
    { id: 'gate-3', name: 'Gate 3 – VIP East', capacity: 2000, type: 'vip', processingRate: 25 },
    { id: 'food-zone', name: 'Food Zone', capacity: 1000, type: 'food', processingRate: 15 },
  ],

  'arun-jaitley-delhi': [
    { id: 'gate-1', name: 'Gate 1 – Bahadur Shah Zafar', capacity: 3000, type: 'gate', processingRate: 40 },
    { id: 'gate-2', name: 'Gate 2 – Bishan Bedi Stand', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-3', name: 'Gate 3 – Gautam Gambhir Stand', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-vip', name: 'VIP / Press Gate', capacity: 1000, type: 'vip', processingRate: 15 },
    { id: 'food-west', name: 'Food Court West Stand', capacity: 800, type: 'food', processingRate: 12 },
  ],

  'dhyan-chand-delhi': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 1500, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'Gate 2 – East Wing', capacity: 1200, type: 'gate', processingRate: 25 },
    { id: 'food-zone', name: 'Refreshments Area', capacity: 400, type: 'food', processingRate: 10 },
  ],

  // --- MAHARASHTRA ---
  'wankhede-mumbai': [
    { id: 'gate-a', name: 'Sachin Gate (North)', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-b', name: 'Sunil Gavaskar Gate (East)', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-c', name: 'Vijay Merchant Gate (South)', capacity: 2200, type: 'gate', processingRate: 32 },
    { id: 'gate-vip', name: 'Garware Pavilion VIP Entry', capacity: 800, type: 'vip', processingRate: 15 },
    { id: 'food-north', name: 'North Stand Food Court', capacity: 600, type: 'food', processingRate: 12 },
    { id: 'food-south', name: 'South Stand Refreshments', capacity: 500, type: 'food', processingRate: 10 },
  ],

  'brabourne-mumbai': [
    { id: 'gate-1', name: 'Main Gate – Marine Drive', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'gate-2', name: 'East Stand Gate', capacity: 1200, type: 'gate', processingRate: 22 },
    { id: 'gate-vip', name: 'CCI Members Gate', capacity: 500, type: 'vip', processingRate: 12 },
    { id: 'food-zone', name: 'Pavilion Cafeteria', capacity: 400, type: 'food', processingRate: 10 },
  ],

  'dy-patil-navi-mumbai': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 3500, type: 'gate', processingRate: 45 },
    { id: 'gate-2', name: 'Gate 2 – West Stand', capacity: 3000, type: 'gate', processingRate: 40 },
    { id: 'gate-3', name: 'Gate 3 – East Gallery', capacity: 2800, type: 'gate', processingRate: 38 },
    { id: 'food-plaza', name: 'Food Plaza', capacity: 1000, type: 'food', processingRate: 15 },
  ],

  'mca-pune': [
    { id: 'gate-1', name: 'Gate 1 – North Entry', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-2', name: 'Gate 2 – South Entry', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-vip', name: 'VIP / Corporate Box', capacity: 800, type: 'vip', processingRate: 15 },
    { id: 'food-court', name: 'Food Court', capacity: 700, type: 'food', processingRate: 12 },
  ],

  // --- KARNATAKA ---
  'chinnaswamy-bengaluru': [
    { id: 'gate-1', name: 'Gate 1 – MG Road Side', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-2', name: 'Gate 2 – Cubbon Park Side', capacity: 2200, type: 'gate', processingRate: 32 },
    { id: 'gate-3', name: 'Gate 3 – East Stand', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-vip', name: 'KSCA Pavilion VIP', capacity: 600, type: 'vip', processingRate: 12 },
    { id: 'food-court', name: 'Food Court', capacity: 800, type: 'food', processingRate: 14 },
  ],

  'kanteerava-bengaluru': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'Gate 2 – Athletes Entry', capacity: 1200, type: 'gate', processingRate: 25 },
    { id: 'food-zone', name: 'Refreshments Corner', capacity: 500, type: 'food', processingRate: 10 },
  ],

  // --- TAMIL NADU ---
  'ma-chidambaram-chennai': [
    { id: 'gate-1', name: 'Gate 1 – Anna Salai End', capacity: 3000, type: 'gate', processingRate: 40 },
    { id: 'gate-2', name: 'Gate 2 – V.P. Stand', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-3', name: 'Gate 3 – I, J, K Stands', capacity: 2800, type: 'gate', processingRate: 38 },
    { id: 'gate-vip', name: 'TNCA Members Pavilion', capacity: 800, type: 'vip', processingRate: 15 },
    { id: 'food-east', name: 'East Side Food Court', capacity: 1000, type: 'food', processingRate: 14 },
  ],

  'mayor-radhakrishnan-chennai': [
    { id: 'gate-1', name: 'Main Entry', capacity: 800, type: 'gate', processingRate: 20 },
    { id: 'gate-2', name: 'Players Gate', capacity: 400, type: 'gate', processingRate: 12 },
    { id: 'food-zone', name: 'Snacks Area', capacity: 200, type: 'food', processingRate: 8 },
  ],

  // --- KERALA ---
  'greenfield-trivandrum': [
    { id: 'gate-1', name: 'Gate 1 – Main Entrance', capacity: 3000, type: 'gate', processingRate: 40 },
    { id: 'gate-2', name: 'Gate 2 – North Stand', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-3', name: 'Gate 3 – South Stand', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'food-court', name: 'Stadium Food Court', capacity: 800, type: 'food', processingRate: 14 },
  ],

  'jln-kochi': [
    { id: 'gate-1', name: 'Main Gate – Kaloor', capacity: 2800, type: 'gate', processingRate: 38 },
    { id: 'gate-2', name: 'Gate 2 – North Wing', capacity: 2200, type: 'gate', processingRate: 32 },
    { id: 'gate-vip', name: 'VIP Entry', capacity: 600, type: 'vip', processingRate: 12 },
    { id: 'food-court', name: 'Food Zone', capacity: 700, type: 'food', processingRate: 12 },
  ],

  // --- TELANGANA & AP ---
  'rajiv-gandhi-hyderabad': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 3500, type: 'gate', processingRate: 45 },
    { id: 'gate-2', name: 'Gate 2 – East Wing', capacity: 3000, type: 'gate', processingRate: 40 },
    { id: 'gate-3', name: 'Gate 3 – West Wing', capacity: 2800, type: 'gate', processingRate: 38 },
    { id: 'gate-vip', name: 'VIP & Corporate Box', capacity: 1200, type: 'vip', processingRate: 18 },
    { id: 'food-plaza', name: 'Grand Food Plaza', capacity: 1500, type: 'food', processingRate: 18 },
  ],

  'balayogi-hyderabad': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'Gate 2 – Athletes Wing', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'food-zone', name: 'Refreshments Corner', capacity: 500, type: 'food', processingRate: 10 },
  ],

  'aca-vdca-vizag': [
    { id: 'gate-1', name: 'Gate 1 – Beach End', capacity: 1800, type: 'gate', processingRate: 28 },
    { id: 'gate-2', name: 'Gate 2 – City End', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'food-zone', name: 'Food Court', capacity: 500, type: 'food', processingRate: 10 },
  ],

  // --- NORTH INDIA ---
  'is-bindra-mohali': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'Gate 2 – City End', capacity: 1800, type: 'gate', processingRate: 28 },
    { id: 'gate-vip', name: 'BCCI VIP Entry', capacity: 500, type: 'vip', processingRate: 12 },
    { id: 'food-court', name: 'North Food Court', capacity: 600, type: 'food', processingRate: 12 },
  ],

  'hpca-dharamshala': [
    { id: 'gate-1', name: 'Gate 1 – Main Hill Entry', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'gate-2', name: 'Gate 2 – Lower Tier', capacity: 1200, type: 'gate', processingRate: 22 },
    { id: 'food-zone', name: 'Mountain View Café', capacity: 400, type: 'food', processingRate: 10 },
  ],

  'ekana-lucknow': [
    { id: 'gate-1', name: 'Gate 1 – Shaheed Path Entry', capacity: 3000, type: 'gate', processingRate: 40 },
    { id: 'gate-2', name: 'Gate 2 – North Stand', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-3', name: 'Gate 3 – East End', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-vip', name: 'Royal Box VIP', capacity: 800, type: 'vip', processingRate: 15 },
    { id: 'food-court', name: 'Food Court', capacity: 1000, type: 'food', processingRate: 14 },
  ],

  'green-park-kanpur': [
    { id: 'gate-1', name: 'Gate 1 – Main Road Entry', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'Gate 2 – Back Gate', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'food-zone', name: 'Snack Stalls', capacity: 500, type: 'food', processingRate: 10 },
  ],

  // --- ODISHA ---
  'kalinga-bhubaneswar': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 1200, type: 'gate', processingRate: 22 },
    { id: 'gate-2', name: 'Gate 2 – Athletes Entrance', capacity: 800, type: 'gate', processingRate: 18 },
    { id: 'food-zone', name: 'Food Zone', capacity: 400, type: 'food', processingRate: 10 },
  ],

  'birsa-munda-rourkela': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'gate-2', name: 'Gate 2 – North Stand', capacity: 1200, type: 'gate', processingRate: 22 },
    { id: 'gate-vip', name: 'VIP Box Entry', capacity: 500, type: 'vip', processingRate: 12 },
    { id: 'food-court', name: 'Food Court', capacity: 400, type: 'food', processingRate: 10 },
  ],

  'barabati-cuttack': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 2800, type: 'gate', processingRate: 38 },
    { id: 'gate-2', name: 'Gate 2 – South Side', capacity: 2200, type: 'gate', processingRate: 32 },
    { id: 'food-zone', name: 'Food Stalls', capacity: 700, type: 'food', processingRate: 12 },
  ],

  // --- RAJASTHAN & MP ---
  'sms-jaipur': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'Gate 2 – East Stand', capacity: 1800, type: 'gate', processingRate: 28 },
    { id: 'gate-vip', name: 'VIP Pavilion', capacity: 500, type: 'vip', processingRate: 12 },
    { id: 'food-court', name: 'Food Court', capacity: 600, type: 'food', processingRate: 12 },
  ],

  'holkar-indore': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'Gate 2 – Narmada Stand', capacity: 1800, type: 'gate', processingRate: 28 },
    { id: 'food-zone', name: 'Food Zone', capacity: 500, type: 'food', processingRate: 10 },
  ],

  // --- NORTH EAST ---
  'barsapara-guwahati': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-2', name: 'Gate 2 – South Stand', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'food-court', name: 'Food Court', capacity: 600, type: 'food', processingRate: 12 },
  ],

  'ig-guwahati': [
    { id: 'gate-1', name: 'Main Gate', capacity: 1800, type: 'gate', processingRate: 28 },
    { id: 'gate-2', name: 'East Entry', capacity: 1200, type: 'gate', processingRate: 22 },
    { id: 'food-zone', name: 'Refreshments Area', capacity: 400, type: 'food', processingRate: 10 },
  ],

  'khuman-lampak-imphal': [
    { id: 'gate-1', name: 'Main Gate', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-2', name: 'East Wing Gate', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'food-zone', name: 'Food Stalls', capacity: 500, type: 'food', processingRate: 10 },
  ],

  // --- GOA & OTHERS ---
  'fatorda-goa': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 1500, type: 'gate', processingRate: 25 },
    { id: 'gate-2', name: 'Gate 2 – West Stand', capacity: 1200, type: 'gate', processingRate: 22 },
    { id: 'food-zone', name: 'Stadium Canteen', capacity: 400, type: 'food', processingRate: 10 },
  ],

  'jsca-ranchi': [
    { id: 'gate-1', name: 'Gate 1 – Main Entry', capacity: 3000, type: 'gate', processingRate: 40 },
    { id: 'gate-2', name: 'Gate 2 – South Stand', capacity: 2500, type: 'gate', processingRate: 35 },
    { id: 'gate-3', name: 'Gate 3 – East Gallery', capacity: 2000, type: 'gate', processingRate: 30 },
    { id: 'gate-vip', name: 'JSCA VIP Box', capacity: 800, type: 'vip', processingRate: 15 },
    { id: 'food-court', name: 'Food Court', capacity: 1000, type: 'food', processingRate: 14 },
  ],
};

/**
 * Returns the zone configuration for a given stadium.
 * If no specific config exists, generates a sensible default based on stadium capacity.
 */
export function getStadiumZones(stadiumId: string, stadiumCapacity: number): StadiumZone[] {
  if (stadiumZonesMap[stadiumId]) {
    return stadiumZonesMap[stadiumId];
  }

  // Generate a default set based on capacity
  const gateCapacity = Math.round(stadiumCapacity * 0.08);
  const foodCapacity = Math.round(stadiumCapacity * 0.03);

  return [
    { id: 'gate-1', name: 'Main Gate', capacity: gateCapacity, type: 'gate', processingRate: Math.round(gateCapacity / 60) },
    { id: 'gate-2', name: 'East Gate', capacity: Math.round(gateCapacity * 0.8), type: 'gate', processingRate: Math.round((gateCapacity * 0.8) / 60) },
    { id: 'gate-3', name: 'West Gate', capacity: Math.round(gateCapacity * 0.7), type: 'gate', processingRate: Math.round((gateCapacity * 0.7) / 60) },
    { id: 'food-court', name: 'Food Court', capacity: foodCapacity, type: 'food', processingRate: Math.round(foodCapacity / 40) },
  ];
}
