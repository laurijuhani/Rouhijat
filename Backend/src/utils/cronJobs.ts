import cron from 'node-cron';
import { parseInstagramData } from './parser';
import postsService from '../services/postsService';
import logger from './logger';


// Scrape Instagram data every hour
cron.schedule('0 * * * *', async () => {
  try {
    const data = await parseInstagramData();
    if (data) {
      await postsService.saveDataToDatabase(data.profile, data.posts);
    } 
  } catch (error) {
    logger.error('Error during scheduled Instagram data scraping:', error);
  }
});
