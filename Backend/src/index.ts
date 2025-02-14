import express from 'express';
import cors from 'cors';
require('dotenv').config();
import { unknownEndpoint, errorHandler } from './utils/middleware';


import blogsRouter from './controllers/blogs';
import gamesRouter from './controllers/games';
import invitesRouter from './controllers/invites';
import usersRouter from './controllers/users';
import authenticateRouter from './controllers/authenticate';

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/blogs', blogsRouter);
apiRouter.use('/games', gamesRouter);
apiRouter.use('/invites', invitesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/auth', authenticateRouter);

app.use('/api/v1', apiRouter);

app.use(unknownEndpoint);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})
