import { Router } from "express";
import postsService from "../services/postsService";
import logger from "../utils/logger";
import { authenticateToken } from "../utils/middleware";
import { parseInstagramData } from "../utils/parser";
import { CustomRequest } from "../utils/types";


const postsRouter = Router();


postsRouter.get('/', async (_req, res) => {
  try {
    const profile = await postsService.getProfileData();
    const posts = await postsService.getPostsData();
    res.status(200).json({ profile, posts });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
}); 



postsRouter.post('/fetch', authenticateToken, async (req: CustomRequest, res) => {
  const user = req.userData?.item; 

  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const data = await parseInstagramData();
    if (data) {
      await postsService.saveDataToDatabase(data.profile, data.posts);
      res.status(200).json({ message: 'Data saved successfully' });
    } else {
      res.status(500).json({ error: 'Failed to parse Instagram data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
    logger.error(error);
  }
});



export default postsRouter;