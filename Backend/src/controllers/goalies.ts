import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import goalieService from "../services/goalieService";
import logger from "../utils/logger";

const goaliesRouter = Router();


goaliesRouter.get('/', async (_req, res) => {
  try {
    const goalies = await goalieService.getAllGoalies();
    if (!goalies) {
      res.status(404).json({ error: 'goalies not found' });
      return;
    }
    res.status(200).json(goalies);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

goaliesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      res.status(400).json({ error: 'malformatted id' });
      return;
    }

    const goalie = await goalieService.getGoalieById(id_number);
    if (!goalie) {
      res.status(404).json({ error: 'goalie not found' });
      return;
    }

    res.status(200).json(goalie);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


goaliesRouter.post('/', authenticateToken, async (req, res) => {
  const { name, nickname, number } = req.body as { name: string, nickname: string, number: number };
  try {
    if (!name) {
      res.status(400).json({ error: 'name missing' });
      return;
    }
    const goalie = await goalieService.createGoalie({ id: 1, name, nickname, number }); // Arbitrary id
    res.status(201).json(goalie);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


goaliesRouter.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, nickname, number } = req.body as { name: string, nickname: string, number: number };

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      res.status(400).json({ error: 'malformatted id' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'name missing' });
      return;
    }

    if (!(await goalieService.getGoalieById(id_number))) {
      res.status(404).json({ error: 'goalie not found' });
      return;
    }

    const goalie = await goalieService.updateGoalie(id_number, { id: 1, name, nickname, number }); // Arbitrary id
    res.status(200).json(goalie);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

goaliesRouter.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const id_number = parseInt(id);
    if (isNaN(id_number)) {
      res.status(400).json({ error: 'malformatted id' });
      return;
    }

    if (!(await goalieService.getGoalieById(id_number))) {
      res.status(404).json({ error: 'goalie not found' });
      return;
    }

    await goalieService.deleteGoalie(id_number);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

export default goaliesRouter;