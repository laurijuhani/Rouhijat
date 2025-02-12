import { Router } from "express";
import prisma from "../utils/client";
require('dotenv').config();

const usersRouter = Router();


usersRouter.get('/getrole', async (req, res): Promise<any> => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const pass = authorization.substring(7);
    if (pass != process.env.GET_ROLE_PASS) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const { email } = req.body as { email: string };

  try {
    const user = await prisma.user.findUnique({
      where: { email},
      select: { role: true },
    });

    if (user) {
      res.json({ role: user.role });
    } else {
      res.status(404).json({ error: 'User not found' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default usersRouter;
