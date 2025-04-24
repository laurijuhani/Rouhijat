import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import pointService from "../services/pointService";
import gameService from "../services/gameService";
import { PlayerData } from "../utils/types";
import logger from "../utils/logger";

const pointsRouter = Router();

pointsRouter.post('/:id', authenticateToken, async (req, res) => {
  const { playerData } = req.body as { playerData: PlayerData[] };
  const gameId = parseInt(req.params.id);

  const game = await gameService.getGameById(gameId);
  if (!game) {
    res.status(404).json({ error: 'game not found' });
    return;
  }

  if (!playerData) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    await pointService.addPointsToGame(gameId, playerData);
    res.status(201).json({ message: 'points added' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

pointsRouter.put('/:id', authenticateToken, async (req, res) => {
  const { playerData } = req.body as { playerData: PlayerData[] };
  const gameId = parseInt(req.params.id);

  const game = await gameService.getGameById(gameId);
  if (!game) {
    res.status(404).json({ error: 'game not found' });
    return;
  }

  if (!playerData) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  const updateArray: PlayerData[] = [];
  const deleteArray: PlayerData[] = [];

  playerData.forEach((data) => {
    if (data.goals === -1) {
      deleteArray.push(data);
    } else {
      updateArray.push(data);
    }
  });

  try {
    await pointService.updatePoints(gameId, updateArray, deleteArray);
    res.status(200).json({ message: 'points updated' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


pointsRouter.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const game_id = parseInt(id);
    const game = await gameService.getGameById(game_id);
    if (!game) {
      res.status(404).json({ error: 'game not found' });
      return;
    }
    const points = await pointService.getPointsByGame(game_id);
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }

});



export default pointsRouter;