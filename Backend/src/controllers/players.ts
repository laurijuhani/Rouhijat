import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import playerService from "../services/playerService";


const playersRouter = Router();


// TODO: add so only active season players and points are returned
playersRouter.get('/', async (_req, res) => {
  try {    
    const players = await playerService.getPlayersAndPoints();
    res.status(200).json(players);    
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.error(error);
  }
});

playersRouter.get('/season/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const players = await playerService.getAllPlayersStatsBySeason(parseInt(id));
    if (!players) {
      res.status(404).json({ error: 'players not found' });
      return;
    }

    res.status(200).json(players);
    } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});


// TODO: All points grouped by season
playersRouter.get('/:id', async (req, res) => {
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

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
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
    console.log(error);
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
    await playerService.deletePlayer(id_number);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
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
    const player = await playerService.updatePlayer(parseInt(id), name, nickname, number);

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});

export default playersRouter;