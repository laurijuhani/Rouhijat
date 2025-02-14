import { Request } from "express";

export interface CustomRequest extends Request {
  token?: string;
  userData?: DecodedToken; 
};


export interface DecodedToken {
  id: number; 
  email: string; 
  name: string;
  picture: string;
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

export interface SignIn {
  email: string;
  name: string;
  picture?: string;
}