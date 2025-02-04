
export type GameData = {
  date: Date,
  homeTeam: string,
  awayTeam: string,
  score: [number, number] | null,
}