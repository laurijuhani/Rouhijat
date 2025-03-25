import { Router } from "express";
import { authenticateToken } from "../utils/middleware";
import pointService from "../services/pointService";
import { PlayerData } from "../services/pointService";

const pointsRouter = Router();

pointsRouter.post('/:id', authenticateToken, async (req, res) => {
  console.log(req.body);
  const { playerData } = req.body as { playerData: PlayerData[] };
  const gameId = parseInt(req.params.id);
  
  if (!playerData) {
    res.status(400).json({ error: 'missing required fields' });
    return;
  }

  try {
    await pointService.addPointsToGame(gameId, playerData);
    res.status(201).json({ message: 'points added' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }
});

pointsRouter.put('/:id', authenticateToken, async (req, res) => {
  const { playerData } = req.body as { playerData: PlayerData[] };
  const gameId = parseInt(req.params.id);

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
    console.log(error);
  }
});


pointsRouter.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const points = await pointService.getPointsByGame(parseInt(id));
    res.json(points);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    console.log(error);
  }

});



export default pointsRouter;