import { Router } from "express";
import seasonService from "../services/seasonService";
import settingsService from "../services/settingsService";
import { authenticateToken } from "../utils/middleware";
import logger from "../utils/logger";

const seasonsRouter = Router();

// add try/catch to all routes

seasonsRouter.get('/', async (_req, res) => {
  try {
    const seasons = await seasonService.getSeasons();
    res.json(seasons);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);  
  }
});

seasonsRouter.get('/current', async (_req, res) => {
  try {
    const currentSeason = await settingsService.getSetting('currentSeason');
    if (!currentSeason) {
      res.status(404).json({ error: 'current season not found' });
      return; 
    }
  
    const season = await seasonService.getSeasonById(parseInt(currentSeason.value));
    if (!season) {
      res.status(404).json({ error: 'current season not found' });
      return; 
    }
  
    res.json(season);    
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

// TODO: admins only
seasonsRouter.post('/current', authenticateToken, async (req, res) => {
  const { id } = req.body as { id: number };
  if (!id) {
    res.status(400).json({ error: 'missing required fields' });
    return; 
  }
  try {
    const season = await seasonService.getSeasonById(id);
    if (!season) {
      res.status(404).json({ error: 'season not found' });
      return; 
    }

    await settingsService.setSetting('currentSeason', id.toString(), ["seasons"]);
    
    res.json(season);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

// Should probably not be used
seasonsRouter.delete('/current', authenticateToken, async (_req, res) => {
  try {
    const currentSeason = await settingsService.getSetting('currentSeason');
    if (!currentSeason) {
      res.status(404).json({ error: 'current season not found' });
      return; 
    }

    await settingsService.deleteSetting('currentSeason');
    
    res.status(204).end();
  }
  catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});



seasonsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const season = await seasonService.getSeasonById(parseInt(id));

    if (!season) {
      res.status(404).json({ error: 'season not found' });
      return; 
    }

    res.json(season);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

seasonsRouter.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body as { name: string };
  if (!name) {
    res.status(400).json({ error: 'missing required fields' });
    return; 
  }

  try {
    const season = await seasonService.createSeason(name);
    res.status(201).json(season);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});


seasonsRouter.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params as { id: string };

  try {
    const deletedSeason = await seasonService.deleteSeason(parseInt(id));
    if (!deletedSeason) {
      res.status(404).json({ error: 'season not found' });
      return; 
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});

seasonsRouter.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params as { id: string };
  const { name } = req.body as { name: string };

  if (!name) {
    res.status(400).json({ error: 'missing required fields' });
    return; 
  }

  try {
    const season = await seasonService.updateSeason(parseInt(id), name);
    res.status(200).json(season);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});




export default seasonsRouter;