export interface Player {
  id: number;
  name: string;
  nickname: string | null;
  games: number;
  points: {
    goals: number;
    assists: number;
  };
}

