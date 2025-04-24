import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import prisma from "../utils/client";
import { CustomRequest } from "../utils/types";
import logger from "../utils/logger";
import redisClient from "../utils/redisClient";
import dotenv from 'dotenv';
dotenv.config();

const usersRouter = Router();


usersRouter.put('/changerole', authenticateToken, async (req: CustomRequest, res) => {
  const user = req.userData?.item;
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  const { id, role } = req.body as { id: string, role: 'admin' | 'user' | 'owner' };

  if (!id || !role) {
    res.status(400).json({ error: 'Missing parameters' });
    return;
  }

  try {
    const userToModify = await prisma.user.findUnique({ where: { id } });
    if (!userToModify) {
      res.status(404).json({ error: 'User not found' });
      return; 
    }

    if (userToModify.role === 'owner') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (userToModify.role === 'admin' && user.role === 'admin') {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await prisma.user.update({ where: { id }, data: { role } });
    res.status(200).json({ message: 'Role updated' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }

});



usersRouter.get('/', authenticateToken, async (req: CustomRequest, res) => {
  const user = req.userData;
  if (!user) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


usersRouter.get('/resetredis', authenticateToken, async (req: CustomRequest, res) => {
  const user = req.userData?.item;
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  try {
    await redisClient.flushAll();
    res.status(200).json({ message: 'Redis cache cleared' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


export default usersRouter;
