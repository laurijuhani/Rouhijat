import { Router } from "express";
import prisma from "../utils/client";
import { authenticateToken } from "../utils/middleware";
import { CustomRequest } from "../utils/types";


const invitesRouter = Router();

invitesRouter.get('/', authenticateToken, async (_req, res): Promise<any> => {
  const invites = await prisma.invitedEmail.findMany();
  res.json(invites.map(invite => invite.email));
});

invitesRouter.post('/', authenticateToken, async (req: CustomRequest, res): Promise<any> => {
  const user = req.userData; 

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { email } = req.body as { email: string };

  try {
    await prisma.invitedEmail.create({
      data: {
        email,
      }
    });

    return res.status(201).json({ message: 'Invitation sent' });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});


invitesRouter.delete('/:id', authenticateToken, async (req: CustomRequest, res): Promise<any> => {
  const user = req.userData; 

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;

  try {
    await prisma.invitedEmail.delete({
      where: {
        id: parseInt(id),
      }
    });

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});


export default invitesRouter;