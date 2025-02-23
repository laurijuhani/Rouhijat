import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import playerService from "../services/playerService";


const playersRouter = Router();



playersRouter.get('/', async (_req, res): Promise<any> => {
  try {    
    const players = await playerService.getPlayersAndPoints();
    res.status(200).json(players);    
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.error(error);
  }
});

playersRouter.get('/:id', async (req, res): Promise<any> => {
  const { id } = req.params;

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      return res.status(400).json({ error: 'malformatted id' });
    }

    const player = await playerService.getPlayerById(id_number);
    if (!player) {
      return res.status(404).json({ error: 'player not found' });
    }

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

playersRouter.post('/', authenticateToken, async (req, res): Promise<any> => {
  const { name, nickname, number } = req.body as { name: string, nickname: string, number: number };

  if (!name || !nickname) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    const player = await playerService.createPlayer(name, nickname, number);

    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

playersRouter.delete('/:id', authenticateToken, async (req, res): Promise<any> => {
  const { id } = req.params;

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      return res.status(400).json({ error: 'malformatted id' });
    }
    await playerService.deletePlayer(id_number);

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

playersRouter.put('/:id', authenticateToken, async (req, res): Promise<any> => {
  const { id, name, nickname, number } = req.body as { id: string, name: string, nickname: string, number: number };

  if (!name || !nickname || !id) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      return res.status(400).json({ error: 'malformatted id' });
    }

    const player = await playerService.updatePlayer(id_number, name, nickname, number);

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default playersRouter;