import { Request } from "express";

export interface CustomRequest extends Request {
  token?: string;
  user?: DecodedToken; 
};


export interface DecodedToken {
  id: number; 
  email: string; 
  name: string;
  iat: number;
  exp: number;
  role: 'admin' | 'user';
};

export interface GameRequest {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  gameDate: string; // Date object as string
};