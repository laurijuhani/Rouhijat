import prisma from "../utils/client";
import redisClient from "../utils/redisClient";

const cacheKey = 'points';

interface GamePoints {
  playerId: number;
  goals: number;
  assists: number;
}

export interface PlayerData {
  playerId: number;
  goals: number;
  assists: number;
}


const getPointsByGame = async (gameId: number): Promise<GamePoints[]> => {
  const cachedPoints = await redisClient.get(cacheKey + gameId);
  if (cachedPoints) {
    return JSON.parse(cachedPoints);
  }

  const points = await prisma.point.findMany({
    where: {
      gameId,
    },
  });

  const gamePoints = points.map((point) => {
    return {
      playerId: point.playerId,
      goals: point.goals,
      assists: point.assists,
    };
  });

  redisClient.set(cacheKey + gameId, JSON.stringify(gamePoints), {
    EX: 3600,
  });

  return gamePoints; 
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

const updatePoints = async (gameId: number, updateData: PlayerData[], deleteData: PlayerData[]) => {
  redisClient.del(cacheKey);
  redisClient.del(cacheKey + gameId);
  redisClient.del('players');

  const upsertPromises = updateData.map((data) => {
    return prisma.point.upsert({
      where: {
        playerId_gameId: {
          gameId,
          playerId: data.playerId,
        },
      },
      update: {
        goals: data.goals,
        assists: data.assists,
      }, 
      create: {
        gameId,
        playerId: data.playerId,
        goals: data.goals,
        assists: data.assists,
      },
    });
  });

  const deletePromises = deleteData.map((data) => {
    return prisma.point.delete({
      where: {
        playerId_gameId: {
          gameId,
          playerId: data.playerId,
        },
      },
    });
  });

  await Promise.all([...upsertPromises, ...deletePromises]);
};

export default {
  getPointsByGame,
  getPoints,
  addPointsToGame,
  updatePoints,
}