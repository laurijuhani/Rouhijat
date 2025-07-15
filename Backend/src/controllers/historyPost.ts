import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import historyPostService from "../services/historyPostService";

import logger from "../utils/logger";

const historyPostsRouter = Router();
const internalHistoryPostsRouter = Router();

historyPostsRouter.post('/', authenticateToken, async (req, res) => {
  let { content, title } = req.body as { content: string; title: string };

  if (!content || !title) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    const result = await historyPostService.addHistoryPost(content, title);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
    return;
  }
});


internalHistoryPostsRouter.get('/', async (_req, res) => {
  try {
    const posts = await historyPostService.getHistoryPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


/*
Endpoints: 
  - POST /api/v1/internal/history-posts - Add a new history post
  - GET /api/v1/internal/history-posts - Get all history posts
  TODO:
  - GET /api/v1/public/history-posts - Get all posts (for authenticated users only)
  - PUT /api/v1/public/history-posts/:id - Update a history post (for admins/owners only)
  - DELETE /api/v1/public/history-posts/:id - Delete a history post (for admins/owners only)
*/  



export { historyPostsRouter, internalHistoryPostsRouter };