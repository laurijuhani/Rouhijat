import prisma from "../utils/client";
import redisClient from "../utils/redisClient";

const cacheKey = 'players';

interface Player {
  id: number;
  name: string;
  nickname: string | null;
  games: number;
  points: {
    goals: number;
    assists: number;
  };
}

const getPlayersAndPoints = async (): Promise<Player[]> => {
  const cachedPlayers = await redisClient.get(cacheKey);
  if (cachedPlayers) {
    return JSON.parse(cachedPlayers);
  }

  const playersWithPoints = await prisma.player.findMany({
    include: {
      points: {
        select: {
          goals: true,
          assists: true,
        },
      },
    },
  });

  const aggregatedPlayers = playersWithPoints.map(player => {
    const games = player.points.length;
    const goals = player.points.reduce((sum, point) => sum + point.goals, 0);
    const assists = player.points.reduce((sum, point) => sum + point.assists, 0);

    const { points, ...rest } = player;
    return {
      ...rest,
      games,
      points: {
        goals,
        assists,
      },
    };
  });

  redisClient.set(cacheKey, JSON.stringify(aggregatedPlayers), {
    EX: 3600,
  });

  return aggregatedPlayers;
};

const getPlayerById = async (id: number): Promise<Player | null> => {
  const cachedPlayers = await redisClient.get(cacheKey);
  if (cachedPlayers) {
    const players = JSON.parse(cachedPlayers);
    const player = players.find((player: any) => player.id === id);
      return player
  }
  const player = await prisma.player.findUnique({
    where: {
      id,
    },
    include: {
      points: {
        select: {
          goals: true,
          assists: true,
        },
      },
    },
  });

  if (!player) {
    return null;
  }

  const games = player.points.length;
  const goals = player.points.reduce((sum, point) => sum + point.goals, 0);
  const assists = player.points.reduce((sum, point) => sum + point.assists, 0);

  const { points, ...rest } = player;
  return {
    ...rest,
    games,
    points: {
      goals,
      assists,
    },
  };
};

const createPlayer = async (name: string, nickname: string, number: number) => {
  redisClient.del(cacheKey);
  return await prisma.player.create({
    data: {
      name,
      nickname: nickname || null,
      number,
    },
  });
};

const updatePlayer = async (id: number, name: string, nickname: string, number: number) => {
  redisClient.del(cacheKey);
  return await prisma.player.update({
    where: {
      id,
    },
    data: {
      name,
      nickname: nickname || null,
      number,
    },
  });
};

const deletePlayer = async (id: number) => {
  redisClient.del(cacheKey);
  return await prisma.player.delete({
    where: {
      id,
    },
  });
};


export default {
  getPlayersAndPoints,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};