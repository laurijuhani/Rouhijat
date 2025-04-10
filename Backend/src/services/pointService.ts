import prisma from "../utils/client";
import redisClient from "../utils/redisClient";
import { PlayerData } from "../utils/types";
const cacheKey = 'points';






const getPointsByGame = async (gameId: number): Promise<PlayerData[]> => {
  const cachedPoints = await redisClient.get(cacheKey + "/" + gameId);
  if (cachedPoints) {
    return JSON.parse(cachedPoints) as PlayerData[];
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
      pm: point.pm,
    };
  });

  void redisClient.set(cacheKey + "/" + gameId, JSON.stringify(gamePoints), {
    EX: 3600,
  });

  return gamePoints; 
};

const addPointsToGame = async (gameId: number, playerData: PlayerData[]) => {
  void redisClient.del(cacheKey + "/" +  gameId);

  const points = playerData.map((data) => {
    return {
      playerId: data.playerId,
      gameId,
      goals: data.goals,
      assists: data.assists,
      pm: data.pm,
    };
  });

  await prisma.point.createMany({
    data: points,
  });
};

const updatePoints = async (gameId: number, updateData: PlayerData[], deleteData: PlayerData[]) => {
  void redisClient.del(cacheKey + "/" +  gameId);

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
        pm: data.pm,
      }, 
      create: {
        gameId,
        playerId: data.playerId,
        goals: data.goals,
        assists: data.assists,
        pm: data.pm,
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
  addPointsToGame,
  updatePoints,
}; 