import express from 'express';
import cors from 'cors';
require('dotenv').config();


import blogsRouter from './controllers/blogs';
import gamesRouter from './controllers/games';
import signInRouter from './controllers/SignIn';

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/blogs', blogsRouter);
apiRouter.use('/games', gamesRouter);
apiRouter.use('/signIn', signInRouter);


app.use('/api/v1', apiRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
})
