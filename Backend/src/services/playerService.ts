import prisma from "../utils/client";
import redisClient from "../utils/redisClient";
import { Player, Points } from "../utils/types";

const cacheKey = 'players';

// TODO: The caching is incorrect atm

// utility function, move it to utils
const aggregatePoints = (points: Points[]): Points => {
  return {
    goals: points.reduce((sum, point) => sum + point.goals, 0),
    assists: points.reduce((sum, point) => sum + point.assists, 0),
    pm: points.reduce((sum, point) => sum + point.pm, 0),
  }; 
}; 


// TODO: Maybe delete this function and use querying 
// from distinct seasons
const getPlayersAndPoints = async (): Promise<Player[]> => {
  const cachedPlayers = await redisClient.get(cacheKey);
  if (cachedPlayers) {
    return JSON.parse(cachedPlayers) as Player[];
  }

  const playersWithPoints = await prisma.player.findMany({
    include: {
      points: {
        select: {
          goals: true,
          assists: true,
          pm: true,
        },
      },
    },
  });

  const aggregatedPlayers = playersWithPoints.map(player => {
    const { points, ...rest } = player;
    return {
      ...rest,
      games: points.length,
      points: {
        goals: points.reduce((sum, point) => sum + point.goals, 0),
        assists: points.reduce((sum, point) => sum + point.assists, 0),
        pm: points.reduce((sum, point) => sum + point.pm, 0),
      },
    };
  });

  void redisClient.set(cacheKey, JSON.stringify(aggregatedPlayers), {
    EX: 3600,
  });

  return aggregatedPlayers;
};

// TODO: Maybe delete this function
const getPlayerById = async (id: number): Promise<Player | null> => {
  const cachedPlayers = await redisClient.get(cacheKey);
  if (cachedPlayers) {
    const players = JSON.parse(cachedPlayers) as Player[];
    const player = players.find((player: Player) => player.id === id);
      return player || null;
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
          pm: true,
        },
      },
    },
  });

  if (!player) {
    return null;
  }

  const { points, ...rest } = player;
  return {
    ...rest,
    games: points.length,
    points: {
      goals: points.reduce((sum, point) => sum + point.goals, 0),
        assists: points.reduce((sum, point) => sum + point.assists, 0),
        pm: points.reduce((sum, point) => sum + point.pm, 0),
    },
  };
};


const getPlayerStatsBySeason = async (playerId: number, seasonId: number) => {
  /*
  const cachedPlayers = await redisClient.get(cacheKey);
  if (cachedPlayers) {
    const players = JSON.parse(cachedPlayers) as Player[];
    const player = players.find((player: Player) => player.id === playerId);
    if (player) {
      return player.points;
    }
  }
  */
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    include: {
      points: {
        where: {
          game: {
            seasonId
          }
        },
        select: {
          goals: true,
          assists: true,
          pm: true,
        },
      },
    },
  });

  if (!player) {
    return null;
  }

  const { points, ...rest } = player;

  return {
    ...rest,
    games: points.length,
    points: aggregatePoints(points),
  };
};

// TODO: getPlayerStatsFromAllSeasons


const getAllPlayersStatsBySeason = async (seasonId: number) => {
  /*
  const cachedPlayers = await redisClient.get(cacheKey);
  if (cachedPlayers) {
    const players = JSON.parse(cachedPlayers) as Player[];
    return players.map(player => ({
      ...player,
      points: player.points,
    }));
  }
  */
  const players = await prisma.player.findMany({
    include: {
      points: {
        where: {
          game: {
            seasonId
          }
        },
        select: {
          goals: true,
          assists: true,
          pm: true,
        },
      },
    },
  });
  const aggregatedPlayers = players.map(player => {
    const { points, ...rest } = player;
    return {
      ...rest,
      games: points.length,
      points: aggregatePoints(points),
    };
  }
  );
  void redisClient.set(cacheKey, JSON.stringify(aggregatedPlayers), {
    EX: 3600,
  });
  return aggregatedPlayers;
};


const createPlayer = async (name: string, nickname: string, number: number) => {
  void redisClient.del(cacheKey);
  return await prisma.player.create({
    data: {
      name,
      nickname: nickname || null,
      number,
    },
  });
};

const updatePlayer = async (id: number, name: string, nickname: string, number: number) => {
  void redisClient.del(cacheKey);
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
  void redisClient.del(cacheKey);
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
  getPlayerStatsBySeason,
  getAllPlayersStatsBySeason
};