import deleteCacheForPattern from "../utils/cacheControl";
import prisma from "../utils/client";
import redisClient from "../utils/redisClient";
import { BasePlayer, Player, PlayerPointsBySeason, Points } from "../utils/types";
import seasonService from "./seasonService";

const cacheKey = 'players';

// TODO: utility function, move it to utils
const aggregatePoints = (points: Points[]): Points => {
  return {
    goals: points.reduce((sum, point) => sum + point.goals, 0),
    assists: points.reduce((sum, point) => sum + point.assists, 0),
    pm: points.reduce((sum, point) => sum + point.pm, 0),
  }; 
}; 


const getAllPlayers = async () => {
  return await prisma.player.findMany();
};


const getPlayerStatsBySeason = async (playerId: number, seasonId: number) => {
  const cachedPlayers = await redisClient.get(cacheKey + "/season/" + seasonId);
  if (cachedPlayers) {
    const players = JSON.parse(cachedPlayers) as Player[];
    const player = players.find((player: Player) => player.id === playerId);
    if (player) {
      return player;
    }
  }
  
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

const getPlayerStatsFromAllSeasons = async (id: number): Promise<PlayerPointsBySeason | null> => {
  const seasons = await seasonService.getSeasons();

  const seasonStats: {seasonId: number, games: number, points: Points}[] = [];
  let playerBase: BasePlayer | null = null;
  for (const season of seasons) {
    const player = await getPlayerStatsBySeason(id, season.id);
    if (player) {
      if (!playerBase) {
        playerBase = {
          id: player.id,
          name: player.name,
          nickname: player.nickname,
          number: player.number,
        };
      }

      seasonStats.push({
        seasonId: season.id,
        games: player.games,
        points: player.points,
      });
    }
  }

  if (!playerBase) {
    return null;
  }

  return {
    ...playerBase,
    seasons: seasonStats,
  };
};


const getAllPlayersStatsBySeason = async (seasonId: number) => {
  const cachedPlayers = await redisClient.get(cacheKey + "/season/" + seasonId);
  if (cachedPlayers) {
    const players = JSON.parse(cachedPlayers) as Player[];
    return players.map(player => ({
      ...player,
      points: player.points,
    }));
  }

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
  void redisClient.set(cacheKey + "/season/" + seasonId, JSON.stringify(aggregatedPlayers), {
    EX: 3600,
  });
  return aggregatedPlayers;
};


const createPlayer = async (name: string, nickname: string, number: number) => {
  void deleteCacheForPattern("games/*");
  void deleteCacheForPattern(cacheKey + "/season/*");
  return await prisma.player.create({
    data: {
      name,
      nickname: nickname || null,
      number,
    },
  });
};

const updatePlayer = async (id: number, name: string, nickname: string, number: number) => {
  void deleteCacheForPattern("games/*");
  void deleteCacheForPattern(cacheKey + "/season/*");
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
  void deleteCacheForPattern("games/*");
  void deleteCacheForPattern(cacheKey + "/season/*");
  return await prisma.player.delete({
    where: {
      id,
    },
  });
};

const getPlayerById = async (id: number) => {
  return await prisma.player.findUnique({
    where: {
      id,
    },
  });
};

export default {
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerById,
  getPlayerStatsBySeason,
  getAllPlayersStatsBySeason,
  getPlayerStatsFromAllSeasons,
  getAllPlayers,
};