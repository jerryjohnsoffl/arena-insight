"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Zone } from './StadiumMap';

// Custom icons targeting external leaflet color markers
const createIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A specific generic user icon
const userIcon = new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  green: createIcon('green'),
  gold: createIcon('gold'),
  red: createIcon('red'),
  blue: createIcon('blue') // Center icon
};

import { Stadium } from '@/data/stadiums';

interface RouteMapProps {
  zones: Zone[];
  stadium?: Stadium;
}

const CITY_COORDS: Record<string, [number, number]> = {
  'Ahmedabad': [23.091, 72.597],
  'Kolkata': [22.564, 88.343],
  'Delhi': [28.582, 77.235],
  'Mumbai': [18.938, 72.825],
  'Navi Mumbai': [19.046, 73.025],
  'Pune': [18.674, 73.706],
  'Bengaluru': [12.978, 77.599],
  'Chennai': [13.062, 80.279],
  'Thiruvananthapuram': [8.530, 76.883],
  'Kochi': [9.998, 76.302],
  'Hyderabad': [17.398, 78.549],
  'Visakhapatnam': [17.797, 83.351],
  'Mohali': [30.690, 76.737],
  'Dharamshala': [32.197, 76.325],
  'Lucknow': [26.811, 81.015],
  'Kanpur': [26.483, 80.347],
  'Bhubaneswar': [20.288, 85.834],
  'Rourkela': [22.259, 84.854],
  'Cuttack': [20.480, 85.867],
  'Jaipur': [26.894, 75.803],
  'Indore': [22.724, 75.875],
  'Guwahati': [26.141, 91.751],
  'Imphal': [24.818, 93.948],
  'Margao': [15.283, 73.966],
  'Ranchi': [23.309, 85.275],
  'Rajkot': [22.361, 70.781]
};

export default function RouteMap({ zones, stadium }: RouteMapProps) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Watch user's real-time physical location
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Use real Indian city coords if available, else fallback
  const centerLat = stadium?.city && CITY_COORDS[stadium.city] ? CITY_COORDS[stadium.city][0] : 51.5560;
  const centerLng = stadium?.city && CITY_COORDS[stadium.city] ? CITY_COORDS[stadium.city][1] : -0.2795;
  
  const stadiumCenter: [number, number] = [centerLat, centerLng];

  // Dynamically map zones around the actual stadium center rather than fixed london coordinates
  const zoneCoords: Record<string, [number, number]> = {
    'gate-a': [centerLat + 0.002, centerLng], // North
    'gate-b': [centerLat, centerLng - 0.002], // West
    'gate-c': [centerLat - 0.002, centerLng], // South
    'food-east': [centerLat, centerLng + 0.002], // East
  };

  const getZoneIcon = (current: number, capacity: number) => {
    const ratio = current / capacity;
    if (ratio >= 0.8) return icons.red;
    if (ratio >= 0.5) return icons.gold;
    return icons.green;
  };

  // Find the fastest/best gate to draw the route to
  const gates = zones.filter(z => z.id.startsWith('gate-'));
  const bestGate = [...gates].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes)[0];
  const targetCoord = bestGate ? (zoneCoords[bestGate.id] || stadiumCenter) : stadiumCenter;

  // Add the Polyline component wrapper so it can access the map
  const MapTracker = () => {
    const map = useMap();
    useEffect(() => {
      if (userPos) {
        // Automatically fit bounds to show both user and target
        const bounds = L.latLngBounds([userPos, targetCoord]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
      } else {
        // If no user pos, just jump to the stadium
        map.setView(stadiumCenter, 16);
      }
    }, [userPos, targetCoord, map, stadiumCenter]);
    return null;
  };

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden mt-4 relative z-0">
      <MapContainer 
        center={stadiumCenter} 
        zoom={16} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <MapTracker />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render GPS Navigation Line */}
        {userPos && (
          <>
            <Polyline 
              positions={[userPos, targetCoord]} 
              color="#6366f1" 
              weight={5} 
              dashArray="10, 15" 
              opacity={0.8}
            />
            <Marker position={userPos} icon={userIcon}>
              <Popup><strong>You are here!</strong><br />GPS Realtime Location</Popup>
            </Marker>
          </>
        )}
        
        {/* Main Stadium Center */}
        <Marker position={stadiumCenter} icon={icons.blue}>
          <Popup>
            <strong>Stadium Core</strong><br />
            Event center.
          </Popup>
        </Marker>
        
        {/* Dynamic Zone Markers */}
        {zones.map(zone => (
          <Marker 
            key={zone.id} 
            position={zoneCoords[zone.id] || stadiumCenter} 
            icon={getZoneIcon(zone.currentCrowd, zone.capacity)}
          >
            <Popup>
              <strong>{zone.name}</strong><br />
              Status: {Math.round((zone.currentCrowd/zone.capacity)*100)}% Capacity<br />
              Wait Time: <strong>{zone.estimatedWaitMinutes} min</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
