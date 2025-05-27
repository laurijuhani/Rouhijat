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
  goalieId?: number;
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
  number: number | null;
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

export interface Goalie extends BasePlayer {}


export interface PictureEdge {
  node: {
    id: string;
    display_url: string;
    is_video: boolean; 
    video_url?: string; 
  }
}

export interface PictureParseData {
  node: {
    id: string;
    shortcode: string;
    display_url: string;
    is_video: boolean;
    video_url?: string;
    taken_at_timestamp: number;
    edge_media_to_comment: {
      count: number;
    };
    edge_liked_by: {
      count: number;
    }
    edge_media_to_caption: {
      edges: {
        node: {
          text: string
        };
      }[];
    };
    edge_sidecar_to_children?: {
      edges: PictureEdge[];
    };
  };
}

export interface BaseProfile {
  id: string; 
  username: string;
  full_name: string;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  biography: string;
  category_name: string; 
  
}

export interface Profile extends BaseProfile {
  number_of_posts: number;
  followers: number; 
  following: number; 
};
export interface ProfileData extends BaseProfile {
  edge_owner_to_timeline_media: {
    count: number;
    edges: PictureParseData[];
  };
  edge_followed_by: {
    count: number;
  };
  edge_follow: {
    count: number;
  };
}
export interface IGPost {
  id: string;
  taken_at_timestamp: number; 
  comment_count: number;
  caption: string; 
  likes: number;
  pictures: Picture[];
  videos: Video[];
}

export interface Picture {
  id: string; 
  display_url: string;
  order: number; // order in the post 
}

export interface Video {
  id: string; 
  display_url: string;
  video_url: string;
  order: number; // order in the post 
}