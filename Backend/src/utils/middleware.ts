import { NextFunction, Response, Request } from "express";
import dotenv from 'dotenv';
dotenv.config();
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { CustomRequest } from "./types";
import { verifyToken } from "./token";
import logger from "./logger";

const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error: Error, _request: Request, response: Response) => {
  logger.error(error.message);
  
  if (error instanceof Error) {
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    } else if (error instanceof JsonWebTokenError) {
      return response.status(400).json({ error: 'token missing or invalid' });
    } else if (error instanceof TokenExpiredError) {
      return response.status(401).json({ error: 'token expired' });
    }
  }

  return response.status(500).json({ error: 'Something went wrong' });
}; 

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return; 
    }

    try {
      const user = verifyToken(token);      
      req.userData = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
      logger.error(error);
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};



export {
  unknownEndpoint,
  errorHandler,
  authenticateToken
};