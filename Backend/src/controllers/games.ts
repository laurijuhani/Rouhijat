import { Router } from "express";
import gameService from "../services/gameService";
import { authenticateToken } from "../utils/middleware";
import { GameRequest, CustomRequest } from "../utils/types";
import seasonService from "../services/seasonService";
import logger from "../utils/logger";

const gamesRouter = Router();


gamesRouter.get('/', async (_req, res) => {
  const games = await gameService.getGames();
  res.json(games);
});

gamesRouter.get('/season/current', async (_req, res) => {  
  try {
    const currentSeason = await seasonService.getCurrentSeason();
    if (!currentSeason) {
      const games = await gameService.getGames();
      res.json(games);
      return;
    }    
    const games = await gameService.getGamesBySeason(currentSeason.id);
    if (!games) {
      res.status(404).json({ error: 'game not found' });
      return;
    }
    res.json(games);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
      logger.error(error);
    }

});

gamesRouter.get('/season/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const games = await gameService.getGamesBySeason(parseInt(id));

    if (!games) {
      res.status(404).json({ error: 'game not found' });
      return; 
    }

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


gamesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const game = await gameService.getGameById(parseInt(id));

    if (!game) {
      res.status(404).json({ error: 'game not found' });
      return; 
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


gamesRouter.post('/', authenticateToken, async (req, res) => {
  const { homeTeam, awayTeam, homeScore, awayScore, gameDate, seasonId, goalieId } = req.body as GameRequest;

  if (!homeTeam || !awayTeam || !gameDate || !seasonId) {
    res.status(400).json({ error: 'missing required fields' });
    return; 
  }

  try {
    const game = await gameService.createGame(homeTeam, awayTeam, homeScore, awayScore, new Date(gameDate), seasonId, goalieId);    
    res.status(201).json(game);
  } catch (error) {    
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


gamesRouter.put('/score/:id', authenticateToken, async (req: CustomRequest, res) => {
  const { id } = req.params;
  const { homeScore, awayScore } = req.body as { homeScore: number, awayScore: number };

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid id parameter' });
    return;
  }
  const gameId = parseInt(id);
  if (isNaN(gameId)) {
    res.status(400).json({ error: 'id parameter must be a number' });
    return;
  }

  if (!homeScore && !awayScore) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    const game = await gameService.updateScore(gameId, homeScore, awayScore);

    res.status(204).json(game);

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});



gamesRouter.put('/:id', authenticateToken, async (req: CustomRequest, res) => {
  const { homeTeam, awayTeam, homeScore, awayScore, gameDate, seasonId, goalieId } = req.body as GameRequest;
  const { id } = req.params;

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid id parameter' });
    return;
  }
  const gameId = parseInt(id);
  if (isNaN(gameId)) {
    res.status(400).json({ error: 'id parameter must be a number' });
    return;
  }

  if (!homeTeam || !awayTeam || !gameDate || !seasonId) {
    res.status(400).json({ error: 'missing required fields' });
    return; 
  }

  try {
    if (!(await gameService.getGameById(gameId))) {
      res.status(404).json({ error: 'game not found' });
      return; 
    }

    await gameService.updateGame(gameId, homeTeam, awayTeam, homeScore, awayScore, new Date(gameDate), seasonId, goalieId);

    res.status(204).end();

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


gamesRouter.delete('/:id', authenticateToken, async (req: CustomRequest, res) => {
  const { id } = req.params;

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid id parameter' });
    return;
  }
  const gameId = parseInt(id);
  if (isNaN(gameId)) {
    res.status(400).json({ error: 'id parameter must be a number' });
    return;
  }

  try {
    if (!(await gameService.getGameById(gameId))) {
      res.status(404).json({ error: 'game not found' });
      return; 
    }
    
    await gameService.deleteGame(gameId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }

});



export default gamesRouter;