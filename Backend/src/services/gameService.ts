import prisma from "../utils/client";
import redisClient from "../utils/redisClient";

const cacheKey = 'games';

const getGames = async () => {
  const cachedGames = await redisClient.get(cacheKey);
  if (cachedGames) {
    return JSON.parse(cachedGames);
  }

  const games = await prisma.game.findMany();

  redisClient.set(cacheKey, JSON.stringify(games), {
    EX: 3600,
  });

  return games;
};

const getGameById = async (id: number) => {
  const cachedGames = await redisClient.get(cacheKey);
  if (cachedGames) {
    const games = JSON.parse(cachedGames);
    const game = games.find((game: any) => game.id === id);
    if (game) {
      return game;
    }
  }

  return await prisma.game.findUnique({
    where: {
      id,
    },
  });
};

const createGame = async (homeTeam: string, awayTeam: string, homeScore: number | undefined, awayScore: number | undefined, gameDate: Date) => {
  redisClient.del(cacheKey);
  
  return await prisma.game.create({
    data: {
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      gameDate,
    },
  });
};

const updateGame = async (id: number, homeTeam: string, awayTeam: string, homeScore: number | undefined, awayScore: number |undefined, gameDate: Date) => {
  redisClient.del(cacheKey);

  return await prisma.game.update({
    where: {
      id,
    },
    data: {
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      gameDate,
    },
  });
};

const deleteGame = async (id: number) => {
  redisClient.del(cacheKey);

  return await prisma.game.delete({
    where: {
      id,
    },
  });
};


export default {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};