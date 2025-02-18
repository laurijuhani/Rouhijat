import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import prisma from "../utils/client";
import { CustomRequest } from "../utils/types";
require('dotenv').config();

const usersRouter = Router();





usersRouter.put('/changerole', authenticateToken, async (req: CustomRequest, res): Promise<any> => {
  const user = req.userData;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id, role } = req.body as { id: string, role: 'admin' | 'user' | 'owner' };

  if (!id || !role) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const userToModify = await prisma.user.findUnique({ where: { id } });
    if (!userToModify) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userToModify.role === 'owner') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (userToModify.role === 'admin' && user.role === 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.user.update({ where: { id }, data: { role } });
    return res.status(200).json({ message: 'Role updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }

})



export default usersRouter;
