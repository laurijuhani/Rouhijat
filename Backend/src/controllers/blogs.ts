import { Router } from "express";
//import { CustomRequest } from "../utils/types";
import prisma from "../utils/client";

const blogsRouter = Router();


blogsRouter.get('/', async (_req, res) => {
  const blogs = await prisma.blogPost.findMany();

  res.json(blogs);
});







export default blogsRouter;