import { useState, useEffect } from 'react';

export interface CricketMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
}

// Fallback mock data used when the live API is unavailable
const MOCK_MATCHES: CricketMatch[] = [
  { id: 'm1', name: 'India vs Australia, 1st T20I', matchType: 't20', status: 'In Progress', venue: 'Wankhede Stadium, Mumbai' },
  { id: 'm2', name: 'KKR vs RCB, IPL 2026', matchType: 't20', status: 'Innings Break', venue: 'Eden Gardens, Kolkata' },
  { id: 'm3', name: 'CSK vs MI, IPL 2026', matchType: 't20', status: 'In Progress', venue: 'M. A. Chidambaram Stadium, Chennai' },
  { id: 'm4', name: 'India vs England, 3rd Test', matchType: 'test', status: 'Day 2 - Session 1', venue: 'Narendra Modi Stadium, Ahmedabad' },
  { id: 'm5', name: 'DC vs SRH, IPL 2026', matchType: 't20', status: 'In Progress', venue: 'Arun Jaitley Stadium, Delhi' },
  { id: 'm6', name: 'RR vs PBKS, IPL 2026', matchType: 't20', status: 'In Progress', venue: 'Sawai Mansingh Stadium, Jaipur' },
  { id: 'm7', name: 'LSG vs GT, IPL 2026', matchType: 't20', status: 'In Progress', venue: 'Ekana Cricket Stadium, Lucknow' },
  { id: 'm8', name: 'SRH vs RCB, IPL 2026', matchType: 't20', status: 'Scheduled', venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseApiMatch(raw: any): CricketMatch {
  return {
    id: raw.id || '',
    name: raw.name || '',
    matchType: raw.matchType || '',
    status: raw.status || '',
    venue: raw.venue || '',
  };
}

function findMatchForStadium(matches: CricketMatch[], stadiumName: string): CricketMatch | null {
  return matches.find(m => {
    const venueLC = m.venue.toLowerCase();
    const stadiumLC = stadiumName.toLowerCase();
    return (
      venueLC.includes(stadiumLC) ||
      stadiumLC.includes(venueLC.split(',')[0].trim())
    );
  }) || null;
}

export function useActiveMatchContext(stadiumName: string) {
  const [activeMatch, setActiveMatch] = useState<CricketMatch | null>(null);
  const [allMatches, setAllMatches] = useState<CricketMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    function useFallback() {
      if (!isMounted) return;
      console.warn('Using mock match data as fallback.');
      setAllMatches(MOCK_MATCHES);
      setActiveMatch(findMatchForStadium(MOCK_MATCHES, stadiumName));
      setUsingMock(true);
    }

    async function fetchMatches() {
      try {
        const res = await fetch('/api/cricket');

        if (!res.ok) {
          useFallback();
          return;
        }

        const json = await res.json();
        if (!isMounted) return;

        if (json.status !== 'success' || !Array.isArray(json.data)) {
          useFallback();
          return;
        }

        const matches: CricketMatch[] = json.data.map(parseApiMatch);
        setAllMatches(matches);
        setActiveMatch(findMatchForStadium(matches, stadiumName));
        setError(null);
        setUsingMock(false);
      } catch {
        useFallback();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    setLoading(true);
    setError(null);
    fetchMatches();

    // Refresh every 2 minutes to stay up to date
    const interval = setInterval(fetchMatches, 2 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [stadiumName]);

  return {
    activeMatch,
    allMatches,
    loading,
    error,
    usingMock,
  };
}

