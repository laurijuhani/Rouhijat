import { Request } from "express";

export interface CustomRequest extends Request {
  token?: string;
  userData?: Data;
  clientIp?: string;
};

export interface Data {
  item: DecodedToken;
  iat: number;
  exp: number;
}

export interface Season {
  id: number;
  name: string;
}

export interface SeasonData extends Season {
  active?: boolean;
}


export type Role = 'admin' | 'user' | 'owner';

export interface DecodedToken {
  id: string; 
  email: string; 
  name: string;
  picture: string;
  iat: number;
  exp: number;
  role: 'admin' | 'user' | 'owner';
}

export interface GameRequest {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  gameDate: string; // Date object as string
  seasonId: number;
}

export interface SignIn {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface GoogleUser {
  id: string;
  emails: { value: string }[];
  displayName: string;
  photos: { value: string }[];
}
export interface Points {
  goals: number;
  assists: number;
  pm: number;
}


export interface BasePlayer {
  id: number;
  name: string;
  nickname: string | null;
  number: number;
}

export interface Player extends BasePlayer {
  games: number;
  points: Points;
}

export interface PlayerPointsBySeason extends BasePlayer {
  seasons: {
    seasonName: string;
    games: number;
    points: Points;
  }[];
} 

export interface PlayerData {
  playerId: number;
  goals: number;
  assists: number;
  pm: number;
}

export interface Goalie {
  id: number;
  name: string;
  nickname: string | null;
  number: number | null;
}
