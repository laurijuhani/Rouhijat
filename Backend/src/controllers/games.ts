import { Router } from "express";
import gameService from "../services/gameService";
import { authenticateToken } from "../utils/middleware";
import { GameRequest, CustomRequest } from "../utils/types";
import seasonService from "../services/seasonService";

const gamesRouter = Router();


gamesRouter.get('/', async (_req, res) => {
  const games = await gameService.getGames();
  res.json(games);
});


gamesRouter.get('/season/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const games = await gameService.getGameBySeason(parseInt(id));

    if (!games) {
      res.status(404).json({ error: 'game not found' });
      return; 
    }

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});

gamesRouter.get('/season/current', async (_req, res) => {
  try {
    const currentSeason = await seasonService.getCurrentSeason();
    if (!currentSeason) {
      res.status(404).json({ error: 'current season not found' });
      return; 
    }
    const games = await gameService.getGameBySeason(currentSeason.id);
    if (!games) {
      res.status(404).json({ error: 'game not found' });
      return;
    }
    res.json(games);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
      console.log(error);
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
    console.log(error);
  }
});


gamesRouter.post('/', authenticateToken, async (req, res) => {
  const { homeTeam, awayTeam, homeScore, awayScore, gameDate, seasonId } = req.body as GameRequest;

  if (!homeTeam || !awayTeam || !gameDate || !seasonId) {
    res.status(400).json({ error: 'missing required fields' });
    return; 
  }

  try {
    const game = await gameService.createGame(homeTeam, awayTeam, homeScore, awayScore, new Date(gameDate), seasonId);    
    res.status(201).json(game);
  } catch (error) {    
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});


gamesRouter.put('/score/:id', authenticateToken, async (req: CustomRequest, res) => {
  const { id } = req.params;
  const { homeScore, awayScore } = req.body as { homeScore: number, awayScore: number };

  if (!homeScore && !awayScore) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    const game = await gameService.updateScore(parseInt(id), homeScore, awayScore);

    res.status(204).json(game);

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});



gamesRouter.put('/:id', authenticateToken, async (req: CustomRequest, res) => {
  const { homeTeam, awayTeam, homeScore, awayScore, gameDate, seasonId } = req.body as GameRequest;
  const { id } = req.params;

  if (!homeTeam || !awayTeam || !gameDate || !seasonId) {
    res.status(400).json({ error: 'missing required fields' });
    return; 
  }

  try {
    await gameService.updateGame(parseInt(id), homeTeam, awayTeam, homeScore, awayScore, new Date(gameDate), seasonId);

    res.status(204).end();

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});


gamesRouter.delete('/:id', authenticateToken, async (req: CustomRequest, res) => {
  const { id } = req.params;

  try {
    await gameService.deleteGame(parseInt(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }

});



export default gamesRouter;