

export type DBUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
  exp: number;
  iat: number;
  role: 'user' | 'admin' | 'owner';
}

export interface Game {
  id: number; 
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  gameDate: string;
}
