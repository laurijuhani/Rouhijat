import { Router } from "express";
import path from 'path';
import express from 'express';
import { authenticateToken } from "../utils/middleware";
import historyPostService from "../services/historyPostService";

import logger from "../utils/logger";

const historyPostsRouter = Router();
const internalHistoryPostsRouter = Router();

// TODO: refactor

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

historyPostsRouter.get('/', authenticateToken, async (_req, res) => {
  try {
    const posts = await historyPostService.getHistoryPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

historyPostsRouter.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content, title } = req.body as { content: string; title: string };

  if (!content || !title) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    const result = await historyPostService.updateHistoryPost(Number(id), content, title);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

historyPostsRouter.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await historyPostService.deleteHistoryPost(Number(id));
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
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

// to serve the images to authenticated users
historyPostsRouter.use('/media', authenticateToken, express.static(path.join(__dirname, '../..', 'media')));

export { historyPostsRouter, internalHistoryPostsRouter };