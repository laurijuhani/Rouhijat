import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Player } from '@/types/basicTypes';

interface PlayersContextProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
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
  const hasFetched = useRef(false);

  const fetchPlayers = useCallback(() => {
    if (!hasFetched.current) {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/players')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data) => {
          setPlayers(data);
          hasFetched.current = true;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <PlayersContext.Provider value={{ players, setPlayers, fetchPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};