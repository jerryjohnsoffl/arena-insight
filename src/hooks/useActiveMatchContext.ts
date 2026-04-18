import { createContext, useContext } from 'react';

export interface ActiveMatch {
    matchId: string;
    venueId: string;
    homeTeam: string;
    awayTeam: string;
    kickoffTime: string;
    isLive: boolean;
}

interface ActiveMatchContextValue {
    activeMatch: ActiveMatch | null;
    setActiveMatch: (match: ActiveMatch | null) => void;
}

export const ActiveMatchContext = createContext<ActiveMatchContextValue>({
    activeMatch: null,
    setActiveMatch: () => { },
});

export function useActiveMatchContext() {
    return useContext(ActiveMatchContext);
}