

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
  seasonId: number; 
}

export interface Season {
  id: number;
  name: string;
  active?: boolean;
}

export interface GamePoints {
  player: {
    name: string;
    number: number;
  }; 
  goals: number;
  assists: number;
  pm: number;
};



export interface GameAndPoints extends Game {
  points: GamePoints[];
}

export interface Player {
  id: number;
  name: string;
  nickname: string | null;
  number: number;
  games: number;
  points: {
    goals: number;
    assists: number;
    pm: number;
  };
}

export type PlayerPointsData = {
  playerId: number;
  goals: number;
  assists: number;
  pm: number;
};