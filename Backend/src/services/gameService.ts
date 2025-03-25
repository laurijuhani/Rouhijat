import prisma from "../utils/client";
import redisClient from "../utils/redisClient";

// TODO: Remove the comments 

const cacheKey = 'games';

const getGames = async () => {
  /*
  const cachedGames = await redisClient.get(cacheKey);
  if (cachedGames) {
    return JSON.parse(cachedGames);
  }
*/
  const games = await prisma.game.findMany();

  void redisClient.set(cacheKey, JSON.stringify(games), {
    EX: 3600,
  });

  return games;
};

const getGameById = async (id: number) => {
  /* 
  const cachedGames = await redisClient.get(cacheKey);
  if (cachedGames) {
    const games = JSON.parse(cachedGames);
    const game = games.find((game: any) => game.id === id);
    if (game) {
      return game;
    }
  }
    */ 

  return await prisma.game.findUnique({
    where: {
      id,
    },
    include: {
      points: {
        select: {
          player: {
            select: {
              name: true,
              number: true,
            }
          },
          goals: true,
          assists: true,
          pm: true,
        }
      }
    }
  });
};

const createGame = async (homeTeam: string, awayTeam: string, homeScore: number | undefined, awayScore: number | undefined, gameDate: Date) => {
  void redisClient.del(cacheKey);
  
  return await prisma.game.create({
    data: {
      homeTeam,
      awayTeam,
      homeScore: homeScore || null,
      awayScore: awayScore || null,
      gameDate,
    },
  });
};

const updateScore = async (id: number, homeScore: number, awayScore: number) => {
  void redisClient.del(cacheKey);

  return await prisma.game.update({
    where: {
      id,
    },
    data: {
      homeScore,
      awayScore,
    },
  });
};


const updateGame = async (id: number, homeTeam: string, awayTeam: string, homeScore: number | undefined, awayScore: number |undefined, gameDate: Date) => {
  void redisClient.del(cacheKey);

  await prisma.game.update({
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
  void redisClient.del(cacheKey);
  void redisClient.del('points' + id);

  await prisma.$transaction(async (prisma) => {
    await prisma.point.deleteMany({
      where: { gameId: id },
    });
    await prisma.game.delete({
      where: { id },
    });
  });
};


export default {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  updateScore,
};