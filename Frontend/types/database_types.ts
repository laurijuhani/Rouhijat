

export type DBUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
  exp: number;
  iat: number;
  role: 'user' | 'admin' | 'owner';
}

export interface Game {
  id: number; 
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  gameDate: string;
  seasonId: number; 
  goalieId: number | null;
}

export interface Season {
  id: number;
  name: string;
  active?: boolean;
}

export interface GamePoints {
  player: {
    name: string;
    number: number;
  }; 
  goals: number;
  assists: number;
  pm: number;
};



export interface GameAndPoints extends Game {
  points: GamePoints[];
  goalie: {
    name: string;
    number: number;
  } | null;
}

export interface BaseInfo {
  id: number;
  name: string;
  nickname: string | null;
  number: number | null;
};

export interface Player extends BaseInfo {
  games: number;
  points: {
    goals: number;
    assists: number;
    pm: number;
  };
}

export interface Goalie extends BaseInfo {
  games: Game[];
}

export type PlayerPointsData = {
  playerId: number;
  goals: number;
  assists: number;
  pm: number;
};



export interface PlayerStats {
  id: number;
  name: string;
  nickname: string | null;
  number: number;
  seasons: {
    seasonName: string;
    games: number;
    points: {
      goals: number;
      assists: number;
      pm: number;
    };
  }[];
}; 

export interface Profile  {
  id: string; 
  username: string;
  full_name: string;
  profile_pic_url: string;
  profile_pic_url_hd: string;
  biography: string;
  category_name: string;
  number_of_posts: number;
  followers: number; 
  following: number; 
};

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

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}