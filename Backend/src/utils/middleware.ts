import { NextFunction, Response, Request } from "express";
require('dotenv').config();
import jwt from 'jsonwebtoken';
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { CustomRequest, DecodedToken } from "./types";
import { verifyToken } from "./token";

const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.log(error.message);
  
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

const tokenExtractor = (req: CustomRequest, _res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = (request: CustomRequest, _response: Response, next: NextFunction) => {
  try {
      if (request.token) {
          const decodedToken = jwt.verify(request.token, process.env.SECRET || '') as DecodedToken;
          request.userData = decodedToken;       
      }
      next();
  } catch (error) {
    next(error);
  }
}; 


const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    
    if (!token) {
      res.status(401).json({ error: 'Token missing' });
      return; 
    }

    try {
      const user = verifyToken(token);
      req.userData = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token missing or invalid' });
    }
  } else {
    res.status(401).json({ error: 'Token missing or invalid' });
  }
};



export {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  authenticateToken
};