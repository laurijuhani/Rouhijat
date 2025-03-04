"use client";

import { User } from "@/hooks/useSession"
import { usePlayers } from "@/context/PlayersContext";
import { lazy, useEffect, useState, Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const EditPlayer = lazy(() => import('./player/EditPlayer'));
const AddPlayer = lazy(() => import('./player/AddPlayer'));


const PlayersList = ({ user }: { user: User }) => {
  const { players, fetchPlayers, setPlayers } = usePlayers();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nimi</TableHead>
            <TableHead>Lempinimi</TableHead>
            <TableHead>Numero</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.nickname || "-"}</TableCell>
              <TableCell>{player.number}</TableCell>
              {user.role === 'admin' || user.role === 'owner' && (
                <TableCell>
                  <Suspense fallback={<div>Ladataan...</div>}>
                    <EditPlayer 
                      player={player} 
                      setPlayers={setPlayers}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />       
                  </Suspense>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {user.role === 'admin' || user.role === 'owner' && (
        <Suspense fallback={<div>Ladataan...</div>}>
          <AddPlayer setPlayers={setPlayers}/>
        </Suspense>
      )}
    </>
  )
}

export default PlayersList
