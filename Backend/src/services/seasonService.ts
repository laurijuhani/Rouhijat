import deleteCacheForPattern from "../utils/cacheControl";
import prisma from "../utils/client";
import redisClient from "../utils/redisClient";
import { SeasonData } from "../utils/types";
import settingsService from "./settingsService";

const cacheKey = 'seasons';


const getSeasons = async () => {
  const cachedSeasons = await redisClient.get(cacheKey);
  if (cachedSeasons) {
    return JSON.parse(cachedSeasons) as SeasonData[];
  }

  const seasons: SeasonData[] = await prisma.season.findMany();
  const activeSeason = await settingsService.getSetting('currentSeason');
  
  seasons.map((season) => {
    if (activeSeason && season.id === parseInt(activeSeason.value)) {
      season.active = true;
    } else {
      season.active = false;
    }
      return season;
  });

  void redisClient.set(cacheKey, JSON.stringify(seasons));

  return seasons;
};



const getSeasonById = async (id: number) => {
  return await prisma.season.findUnique({
    where: {
      id,
    },
  });
};

const createSeason = async (name: string) => {
  void redisClient.del(cacheKey);
  return await prisma.season.create({
    data: {
      name,
    },
  });
};


const updateSeason = async (id: number, name: string) => {
  void redisClient.del(cacheKey);
  return await prisma.season.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

const deleteSeason = async (id: number) => {
  void redisClient.del(cacheKey);
  void deleteCacheForPattern('games/season/:id');
  void deleteCacheForPattern('players/season/:id');
  return await prisma.season.delete({
    where: {
      id,
    },
  });
};


const getCurrentSeason = async () => {
  const id = await settingsService.getSetting('currentSeason');
  if (!id) {
    return null;
  }

  const cachedSeasons = await redisClient.get(cacheKey);
  if (cachedSeasons) {
    const data = JSON.parse(cachedSeasons) as SeasonData[];
    const season = data.find((season) => season.active === true);
    if (season) {
      return season;
    }
    return null;
  }


  const season = await prisma.season.findUnique({
    where: {
      id: parseInt(id.value),
    },
  });  
  if (!season) {
    return null;
  }
  return season;
};




export default {
  getSeasons,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
  getCurrentSeason,
};