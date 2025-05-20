"use client";

import { User } from "@/hooks/useSession";
import { usePlayers } from "@/context/PlayersContext";
import { lazy, useEffect, useState, Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddGoalie from "./player/AddGoalie";

const EditPlayer = lazy(() => import('./player/EditPlayer'));
const EditGoalie = lazy(() => import('./player/EditGoalie'));
const AddPlayer = lazy(() => import('./player/AddPlayer'));


const PlayersList = ({ user }: { user: User }) => {
  const { players, fetchPlayers, setPlayers, goalies, setGoalies } = usePlayers();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);
  
  return (
    <div className="mb-16">
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
              <TableCell>{player.number || '-'}</TableCell>
              {(user.role === 'admin' || user.role === 'owner') && (
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
      {(user.role === 'admin' || user.role === 'owner') && (
        <Suspense fallback={<div>Ladataan...</div>}>
          <div className="flex justify-center mt-4 md:justify-start md:ml-4">
            <AddPlayer setPlayers={setPlayers}/>
          </div>
        </Suspense>
      )}

      <h2 className="text-xl font-bold ml-2 mt-8 mb-4">Maalivahdit:</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nimi</TableHead>
            <TableHead>Lempinimi</TableHead>
            <TableHead>Numero</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goalies.map((goalie) => (
            <TableRow key={goalie.id}>
              <TableCell>{goalie.name}</TableCell>
              <TableCell>{goalie.nickname || "-"}</TableCell>
              <TableCell>{goalie.number || '-'}</TableCell>
              {(user.role === 'admin' || user.role === 'owner') && (
                <TableCell>
                  <Suspense fallback={<div>Ladataan...</div>}>
                    <EditGoalie 
                      goalie={goalie} 
                      setGoalies={setGoalies}
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
      {(user.role === 'admin' || user.role === 'owner') && (
        <Suspense fallback={<div>Ladataan...</div>}>
          <div className="flex justify-center mt-4 md:justify-start md:ml-4">
            <AddGoalie setGoalies={setGoalies}/>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default PlayersList;
