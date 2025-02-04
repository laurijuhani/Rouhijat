import jwt from 'jsonwebtoken';
import { Router } from 'express';
const loginRouter = Router();
import { CustomRequest } from '../utils/types';
import prisma from '../utils/client';








export default loginRouter;