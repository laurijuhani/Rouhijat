import { Game } from "../../prisma/app/generated/prisma/client";
import prisma from "../utils/client";
import redisClient from "../utils/redisClient";
import deleteCacheForPattern from "../utils/cacheControl";

const cacheKey = 'games';

// If working correctly, this should not be needed
const getGames = async () => {
  return await prisma.game.findMany();
};

const getGamesBySeason = async (seasonId: number) => {
  const cachedGames = await redisClient.get(cacheKey + "/season/" + seasonId);
  if (cachedGames) return JSON.parse(cachedGames) as Game[];    

  const season = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
  });
  
  if (!season) {
    return null;
  }
  
  const games = await prisma.game.findMany({
    where: {
      seasonId,
    },
  });

  const sortedGames = games.sort((a, b) => {
    return new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime();
  });

  void redisClient.set(cacheKey + "/season/" + seasonId, JSON.stringify(sortedGames), {
    EX: 3600,
  });

  return sortedGames;
};

const getGameById = async (id: number) => {
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
      },
      goalie: {
        select: {
          name: true,
          number: true,
      }
    }
  }
  });
};

const createGame = async (homeTeam: string, awayTeam: string, homeScore: number | undefined, awayScore: number | undefined, gameDate: Date, seasonId: number, goalieId: number | undefined) => {
  void redisClient.del(cacheKey + "/season/" + seasonId);
  void redisClient.del("players/season/" + seasonId);
  void redisClient.del("goalies"); 
  void deleteCacheForPattern(cacheKey + "/*");

  return await prisma.game.create({
    data: {
      homeTeam,
      awayTeam,
      homeScore: homeScore || null,
      awayScore: awayScore || null,
      gameDate,
      seasonId,
      goalieId: goalieId || null,
    },
  });
};

const updateScore = async (id: number, homeScore: number, awayScore: number) => {
  const game = await prisma.game.update({
    where: {
      id,
    },
    data: {
      homeScore,
      awayScore,
    },
  });

  void redisClient.del(cacheKey + "/season/" + game.seasonId);
  void redisClient.del("players/season/" + game.seasonId); 
  void redisClient.del("goalies");
  void deleteCacheForPattern(cacheKey + "/*");

  return game;
};


const updateGame = async (id: number, homeTeam: string, awayTeam: string, homeScore: number | undefined, awayScore: number |undefined, gameDate: Date, seasonId: number, goalieId: number | undefined) => {
  void redisClient.del(cacheKey + "/season/" + seasonId);
  void redisClient.del("players/season/" + seasonId); 
  void redisClient.del("goalies");
  void deleteCacheForPattern(cacheKey + "/*");
  const game = await prisma.game.findUnique({
    where: {
      id,
    },
  });
  if (!game) {
    throw new Error("Game not found");
  }

  // Check if the seasonId has changed
  if (game.seasonId !== seasonId) {
    void redisClient.del(cacheKey + "/season/" + game.seasonId);
    void redisClient.del("players/season/" + game.seasonId); 
  }

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
      seasonId,
      goalieId: goalieId || null,
    },
  });
};

const deleteGame = async (id: number) => {
  const game = await prisma.game.findUnique({
    where: {
      id,
    },
  });
  if (!game) {
    throw new Error("Game not found");
  }

  void redisClient.del(cacheKey + "/season/" + game.seasonId);
  void redisClient.del("players/season/" + game.seasonId); 
  void redisClient.del("goalies");
  void deleteCacheForPattern(cacheKey + "/*");

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
  getGamesBySeason,
};