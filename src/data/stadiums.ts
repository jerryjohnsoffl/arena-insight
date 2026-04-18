export interface Stadium {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number;
  type: 'Cricket' | 'Football' | 'Hockey' | 'Multi-purpose' | 'Athletics';
}

export const stadiums: Stadium[] = [
  { id: 'stadium-a', name: 'Stadium A', city: 'London', state: 'UK', capacity: 60000, type: 'Football' },
];
