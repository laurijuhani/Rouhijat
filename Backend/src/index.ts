import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { unknownEndpoint, errorHandler } from './utils/middleware';

import { generalRateLimiter, loginRateLimiter } from './utils/rateLimiter';
import gamesRouter from './controllers/games';
import invitesRouter from './controllers/invites';
import usersRouter from './controllers/users';
import playersRouter from './controllers/players';
import pointsRouter from './controllers/points';
import authenticateRouter from './controllers/authenticate';
import clientIp from './utils/clientIp';
import redisClient from './utils/redisClient';

const app = express();

app.use(cors());
app.use(express.json());

app.use(clientIp);
app.use(generalRateLimiter);

const apiRouter = express.Router();

apiRouter.use('/games', gamesRouter);
apiRouter.use('/invites', invitesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/auth', loginRateLimiter, authenticateRouter);
apiRouter.use('/players', playersRouter);
apiRouter.use('/points', pointsRouter);

app.use('/api/v1', apiRouter);

app.use(unknownEndpoint);

app.use((err: Error, req: express.Request, res: express.Response) => {
  errorHandler(err, req, res);
});


// Flush Redis cache on startup
(async () => {
  try {
    await redisClient.flushAll(); 
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})().catch((error) => {
  console.error('Unexpected error:', error);
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
