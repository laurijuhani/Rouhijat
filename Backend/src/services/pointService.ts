import prisma from "../utils/client";
import redisClient from "../utils/redisClient";

const cacheKey = 'players';

interface GamePoints {
  playerId: number;
  gameId: number;
  goals: number;
  assists: number;
}

interface PlayerData {
  playerId: number;
  goals: number;
  assists: number;
}


const getPointsByGame = async (gameId: number): Promise<GamePoints[]> => {
  const cachedPoints = await redisClient.get(cacheKey);
  if (cachedPoints) {
    const points = JSON.parse(cachedPoints);
    const gamePoints = points.filter((point: any) => point.gameId === gameId);
    return gamePoints;
  }

  return await prisma.point.findMany({
    where: {
      gameId,
    },
  }) ;
};


const getPoints = async (): Promise<GamePoints[]> => {
  const cachedPoints = await redisClient.get(cacheKey);
  if (cachedPoints) {
    return JSON.parse(cachedPoints);
  }

  const points = await prisma.point.findMany();

  redisClient.set(cacheKey, JSON.stringify(points), {
    EX: 3600,
  });

  return points;
};


const addPointsToGame = async (gameId: number, playerData: PlayerData[]) => {
  redisClient.del(cacheKey);

  const points = playerData.map((data) => {
    return {
      playerId: data.playerId,
      gameId,
      goals: data.goals,
      assists: data.assists,
    };
  });

  await prisma.point.createMany({
    data: points,
  });
};

const updatePoints = async (gameId: number, playerData: PlayerData[]) => {
  redisClient.del(cacheKey);

  const points = playerData.map((data) => {
    return {
      playerId: data.playerId,
      gameId,
      goals: data.goals,
      assists: data.assists,
    };
  });

  await prisma.point.updateMany({
    where: {
      gameId,
    },
    data: points,
  });
};

export default {
  getPointsByGame,
  getPoints,
  addPointsToGame,
  updatePoints,
}