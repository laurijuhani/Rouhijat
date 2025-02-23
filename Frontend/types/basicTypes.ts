export interface Player {
  id: number;
  name: string;
  nickname: string | null;
  number: number;
  games: number;
  points: {
    goals: number;
    assists: number;
  };
}


