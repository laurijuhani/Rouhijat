import { Router } from "express";
//import { CustomRequest } from "../utils/types";
import prisma from "../utils/client";

const gamesRouter = Router();


gamesRouter.get('/', async (_req, res) => {
  const blogs = await prisma.game.findMany();

  res.json(blogs);
});







export default gamesRouter;