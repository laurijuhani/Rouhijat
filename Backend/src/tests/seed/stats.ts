import prisma from "../../utils/client";

const seasons = [
  { id: 1, name: "Spring" },
  { id: 2, name: "Summer" },
  { id: 3, name: "Fall" },
  { id: 4, name: "Winter" },
]; 

const games = [
  { id: 1, homeTeam: "Team A", awayTeam: "Team B", homeScore: 3, awayScore: 2, gameDate: "2023-01-01T00:00:00.000Z", seasonId: 1, goalieId: 1 },
  { id: 2, homeTeam: "Team C", awayTeam: "Team D", homeScore: 1, awayScore: 4, gameDate: "2023-01-02T00:00:00.000Z", seasonId: 1 },
  { id: 3, homeTeam: "Team E", awayTeam: "Team F", homeScore: 2, awayScore: 2, gameDate: "2023-01-03T00:00:00.000Z", seasonId: 2 },
  { id: 4, homeTeam: "Team G", awayTeam: "Team H", homeScore: 5, awayScore: 1, gameDate: "2023-01-04T00:00:00.000Z", seasonId: 2 },
  { id: 5, homeTeam: "Team I", awayTeam: "Team J", homeScore: 0, awayScore: 0, gameDate: "2023-01-05T00:00:00.000Z", seasonId: 3 },
  { id: 6, homeTeam: "Team K", awayTeam: "Team L", homeScore: 3, awayScore: 3, gameDate: "2023-01-06T00:00:00.000Z", seasonId: 3 },
  { id: 7, homeTeam: "Team M", awayTeam: "Team N", homeScore: 4, awayScore: 2, gameDate: "2023-01-07T00:00:00.000Z", seasonId: 4 },
  { id: 8, homeTeam: "Team O", awayTeam: "Team P", homeScore: 1, awayScore: 5, gameDate: "2023-01-08T00:00:00.000Z", seasonId: 4 },
];

const players = [
  { id: 1, name: "Player A", nickname: "A", number: 10 },
  { id: 2, name: "Player B", nickname: "B", number: 11 },
  { id: 3, name: "Player C", nickname: "C", number: 12 },
  { id: 4, name: "Player D", nickname: "D", number: 13 },
]; 

const goalies = [
  { id: 1, name: "Goalie A", nickname: "A", number: 30 },
  { id: 2, name: "Goalie B", nickname: "B", number: 31 },
  { id: 3, name: "Goalie C", nickname: "C", number: 32 },
]; 

const points = [
  { playerId: 1, gameId: 1, goals: 2, assists: 1, pm: 3 },
  { playerId: 1, gameId: 2, goals: 1, assists: 0, pm: 1 },
  { playerId: 2, gameId: 1, goals: 0, assists: 1, pm: 1 },
  { playerId: 2, gameId: 2, goals: 1, assists: 0, pm: 1 },
  { playerId: 3, gameId: 3, goals: 0, assists: 2, pm: 2 },
  { playerId: 3, gameId: 4, goals: 1, assists: 1, pm: 2 },
  { playerId: 4, gameId: 3, goals: 1, assists: 0, pm: -1 },
  { playerId: 4, gameId: 4, goals: 0, assists: 1, pm: 1 },
  { playerId: 1, gameId: 5, goals: 0, assists: 0, pm: 0 },
  { playerId: 1, gameId: 6, goals: 1, assists: 0, pm: 1 },
  { playerId: 2, gameId: 5, goals: 0, assists: 1, pm: 1 },
  { playerId: 2, gameId: 6, goals: 0, assists: 0, pm: 0 },
  { playerId: 3, gameId: 7, goals: 2, assists: 1, pm: -3 },
  { playerId: 3, gameId: 8, goals: 0, assists: 0, pm: 0 },
  { playerId: 4, gameId: 7, goals: 1, assists: 0, pm: 1 },
];

const currentSeason = { key: "currentSeason", value: "2" };

const seedStats = async () => {
  await prisma.season.createMany({ data: seasons });
  await prisma.goalie.createMany({ data: goalies });
  await prisma.game.createMany({ data: games });
  await prisma.player.createMany({ data: players });
  await prisma.point.createMany({ data: points });
  await prisma.setting.create({ data: currentSeason });
};

const clearStats = async () => {
  await prisma.point.deleteMany({});
  await prisma.player.deleteMany({});
  await prisma.goalie.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.season.deleteMany({});
  await prisma.setting.deleteMany({});
};

export default {
  seedStats,
  clearStats,
};