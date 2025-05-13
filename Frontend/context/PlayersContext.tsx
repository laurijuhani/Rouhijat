import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Goalie, Player } from '@/types/database_types';

interface PlayersContextProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  goalies: Goalie[];
  setGoalies: React.Dispatch<React.SetStateAction<Goalie[]>>;
  fetchPlayers: () => void;
}

const PlayersContext = createContext<PlayersContextProps | undefined>(undefined);

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

export const PlayersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [goalies, setGoalies] = useState<Goalie[]>([]); 
  const hasFetched = useRef(false);

  const fetchPlayers = useCallback(() => {
    if (!hasFetched.current) {
      Promise.all([
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/players'),
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/goalies'),
      ])
        .then(async ([playersResponse, goaliesResponse]) => {
          if (!playersResponse.ok || !goaliesResponse.ok) {
            throw new Error('Failed to fetch data');
          }
          const playersData = await playersResponse.json();
          const goaliesData = await goaliesResponse.json();
          setPlayers(playersData);
          setGoalies(goaliesData);
          hasFetched.current = true;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <PlayersContext.Provider value={{ players, setPlayers, goalies, setGoalies, fetchPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};