
export type GameData = {
  date: Date,
  homeTeam: string,
  awayTeam: string,
  score: [number, number] | null,
}

export type DBUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
  exp: number;
  iat: number;
  role: 'user' | 'admin' | 'owner';
}