import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { unknownEndpoint, errorHandler } from './utils/middleware';

import { generalRateLimiter, loginRateLimiter } from './utils/rateLimiter';
import gamesRouter from './controllers/games';
import invitesRouter from './controllers/invites';
import usersRouter from './controllers/users';
import playersRouter from './controllers/players';
import pointsRouter from './controllers/points';
import seasonsRouter from './controllers/seasons';
import goaliesRouter from './controllers/goalies';
import authenticateRouter from './controllers/authenticate';
import clientIp from './utils/clientIp';
import redisClient from './utils/redisClient';
import logger from './utils/logger';
import { internalPostsRouter, postsRouter} from './controllers/posts';
import { historyPostsRouter, internalHistoryPostsRouter } from './controllers/historyPost';


const app = express();

app.use(cors());
app.use(helmet()); 

app.use(clientIp);
app.use(generalRateLimiter);

const apiRouter = express.Router();
const internalRouter = express.Router();
const payloadRouter = express.Router();
payloadRouter.use(express.json({ limit: '20mb' })); // Increased limit for payloads

apiRouter.use('/games', gamesRouter);
apiRouter.use('/invites', invitesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/auth', loginRateLimiter, authenticateRouter);
apiRouter.use('/players', playersRouter);
apiRouter.use('/points', pointsRouter);
apiRouter.use('/seasons', seasonsRouter);
apiRouter.use('/goalies', goaliesRouter);
apiRouter.use('/posts', postsRouter);
payloadRouter.use('/history-posts', historyPostsRouter);
apiRouter.use('/media/videos', express.static(path.join(__dirname, '..', 'media', 'videos')));

app.use('/api/v1/public', apiRouter);
app.use('/api/v1/public', payloadRouter);

internalRouter.use('/media', express.static(path.join(__dirname, '..', 'media')));
internalRouter.use('/posts', internalPostsRouter);
internalRouter.use('/history-posts', internalHistoryPostsRouter);

app.use('/api/v1/internal', internalRouter);

app.use(express.json());
app.use(unknownEndpoint);

app.use((err: Error, req: express.Request, res: express.Response) => {
  errorHandler(err, req, res);
});

export { app };

if (process.env.NODE_ENV !== 'test') {
  // Import cron jobs only when not in test mode
  require('./utils/cronJobs');

  // Flush Redis cache on startup
  (async () => {
    try {
      await redisClient.flushAll();
    } catch (error) {
      logger.error('Failed to flush Redis cache:', error);
    }
  })().catch((error) => {
    logger.error('Unexpected error:', error);
  });

  app.listen(process.env.PORT, () => {
    logger.info(`Server running on port ${process.env.PORT}`);
  });
}
