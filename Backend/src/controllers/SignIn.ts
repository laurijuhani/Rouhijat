import { Router } from "express";
import prisma from "../utils/client";

const signInRouter = Router();

signInRouter.post('/', async (req, res): Promise<any> => {
  const { email, name, image } = req.body as { email: string, name: string, image: string | null };
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return res.status(200).json({ allowed: true });
  
  const invitation = await prisma.invitedEmail.findUnique({ where: { email } });

  if (invitation) {
    try {
      await prisma.$transaction([
        prisma.user.create({ 
          data: { 
            email,
            name,
            image,
          },
        }),
        prisma.invitedEmail.delete({ where: { email } }),
      ]);

      res.status(200).json({ allowed: true });
    } catch (error) {
      res.status(500).json({ allowed: false });
      console.log(error);
    }
    res.status(200).json({ allowed: true });
  } else {
    res.status(403).json({ allowed: false });
  }
});

export default signInRouter;