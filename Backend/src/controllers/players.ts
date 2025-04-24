import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import playerService from "../services/playerService";
import seasonService from "../services/seasonService";
import logger from "../utils/logger";


const playersRouter = Router();


playersRouter.get('/season/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const id_number = parseInt(id);
    const season = await seasonService.getSeasonById(id_number);
    if (!season) {
      res.status(404).json({ error: 'season not found' });
      return;
    }

    const players = await playerService.getAllPlayersStatsBySeason(id_number);
    if (!players) {
      res.status(404).json({ error: 'players not found' });
      return;
    }

    res.status(200).json(players);
    } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


playersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      res.status(400).json({ error: 'malformatted id' });
      return;
    }

    const player = await playerService.getPlayerStatsFromAllSeasons(id_number);
    if (!player) {
      res.status(404).json({ error: 'player not found' });
      return;
    }

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

playersRouter.post('/', authenticateToken, async (req, res) => {
  const { name, nickname, number } = req.body as { name: string, nickname: string, number: number };

  if (!name || !number) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    const player = await playerService.createPlayer(name, nickname, number);
  
    res.status(201).json(player.id);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

playersRouter.get('/', async (_req, res) => {
  try {
    const players = await playerService.getAllPlayers();
    if (!players) {
      res.status(404).json({ error: 'players not found' });
      return;
    }

    res.status(200).json(players);
  }
  catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


playersRouter.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      res.status(400).json({ error: 'malformatted id' });
      return;
    }

    const player = await playerService.getPlayerById(id_number);
    if (!player) {
      res.status(404).json({ error: 'player not found' });
      return;
    }
    await playerService.deletePlayer(id_number);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

playersRouter.put('/:id', authenticateToken, async (req, res) => {
  const { name, nickname, number } = req.body as { name: string, nickname: string, number: number };
  const { id } = req.params;

  if (!name || !id) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    const id_number = parseInt(id);

    if (!(await playerService.getPlayerById(id_number))) {
      res.status(404).json({ error: 'player not found' });
      return;
    }

    const player = await playerService.updatePlayer(id_number, name, nickname, number);

    res.status(204).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

export default playersRouter;