import prisma from "../utils/client";
import redisClient from "../utils/redisClient";
import { Goalie } from "../utils/types";


const cacheKey = 'goalies';

const getAllGoalies = async () => {
  const cachedGoalies = await redisClient.get(cacheKey);
  if (cachedGoalies) {
    return JSON.parse(cachedGoalies) as Goalie[];
  }

  const goalies = await prisma.goalie.findMany({
    include: {
      games: true,
    }
  });

  await redisClient.set(cacheKey, JSON.stringify(goalies));

  return goalies;
};


const getGoalieById = async (id: number) => {
  const cachedGoalies = await redisClient.get(cacheKey);
  if (cachedGoalies) {
    const goalies = JSON.parse(cachedGoalies) as Goalie[];
    const goalie = goalies.find((goalie: Goalie) => goalie.id === id);
    if (goalie) {
      return goalie;
    }
  }

  const goalie = await prisma.goalie.findUnique({
    where: {
      id,
    },
    include: {
      games: true,
    }
  });
  if (!goalie) {
    return null;
  }
  return goalie;
};


const createGoalie = async (goalie: Goalie) => {
  void redisClient.del(cacheKey);
  return await prisma.goalie.create({
    data: {
      name: goalie.name,
      nickname: goalie.nickname || null,
      number: goalie.number || null,
    },
  });
};

const updateGoalie = async (id: number, goalie: Goalie) => {
  void redisClient.del(cacheKey);
  return await prisma.goalie.update({
    where: {
      id,
    },
    data: {
      name: goalie.name,
      nickname: goalie.nickname || null,
      number: goalie.number || null,
    },
  });
};

const deleteGoalie = async (id: number) => {
  void redisClient.del(cacheKey);
  return await prisma.goalie.delete({
    where: {
      id,
    },
  });
};



export default {
  getAllGoalies,
  getGoalieById,
  createGoalie,
  updateGoalie,
  deleteGoalie,
};