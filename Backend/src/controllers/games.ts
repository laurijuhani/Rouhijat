import { Router } from "express";
import gameService from "../services/gameService";
import { authenticateToken } from "../utils/middleware";
import { GameRequest, CustomRequest } from "../utils/types";

const gamesRouter = Router();


gamesRouter.get('/', async (_req, res): Promise<any> => {
  const games = await gameService.getGames();
  res.json(games);
});

gamesRouter.get('/:id', async (req, res): Promise<any> => {
  const { id } = req.params;

  try {
    const game = await gameService.getGameById(parseInt(id));

    if (!game) {
      return res.status(404).json({ error: 'game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


gamesRouter.post('/', authenticateToken, async (req, res): Promise<any> => {
  const { homeTeam, awayTeam, homeScore, awayScore, gameDate } = req.body as GameRequest;

  if (!homeTeam || !awayTeam || !gameDate) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    const game = await gameService.createGame(homeTeam, awayTeam, homeScore, awayScore, new Date(gameDate));
    console.log(game);
    
    res.status(201).json(game);

  } catch (error) {    
    res.status(500).json({ error: 'Something went wrong' });
  }
});


gamesRouter.put('/score/:id', authenticateToken, async (req: CustomRequest, res): Promise<any> => {
  const { id } = req.params;
  const { homeScore, awayScore } = req.body as { homeScore: number, awayScore: number };

  if (!homeScore && !awayScore) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    const game = await gameService.updateScore(parseInt(id), homeScore, awayScore);

    res.status(204).json(game);

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});



gamesRouter.put('/:id', authenticateToken, async (req: CustomRequest, res): Promise<any> => {
  const { homeTeam, awayTeam, homeScore, awayScore, gameDate } = req.body as GameRequest;
  const { id } = req.params;

  if (!homeTeam || !awayTeam || !gameDate) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    await gameService.updateGame(parseInt(id), homeTeam, awayTeam, homeScore, awayScore, new Date(gameDate));

    res.status(204).end();

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


gamesRouter.delete('/:id', authenticateToken, async (req: CustomRequest, res): Promise<any> => {
  const { id } = req.params;

  try {
    await gameService.deleteGame(parseInt(id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }

});



export default gamesRouter;