import { Router } from "express";
import prisma from "../utils/client";
import { authenticateToken } from "../utils/middleware";
import { CustomRequest } from "../utils/types";
import mailer from "../utils/mailer";
import logger from "../utils/logger";


const invitesRouter = Router();

invitesRouter.get('/', authenticateToken, async (_req, res) => {
  const invites = await prisma.invitedEmail.findMany();
  res.json(invites.map(invite => invite.email));
});

invitesRouter.post('/', authenticateToken, async (req: CustomRequest, res) => {
  const user = req.userData?.item; 

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  const { email } = req.body as { email: string };

  try {
    await prisma.invitedEmail.create({
      data: {
        email,
      }
    });

    // if you dont want to use the mailer, comment this line
    await mailer.sendInviteEmail(email);

    res.status(201).json({ message: 'Invitation sent' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


invitesRouter.delete('/:email', authenticateToken, async (req: CustomRequest, res) => {
  const user = req.userData?.item;
  
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {    
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  const { email } = req.params;
  
  try {
    await prisma.invitedEmail.delete({
      where: {
        email,
      }
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


export default invitesRouter;