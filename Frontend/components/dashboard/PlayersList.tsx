"use client";

import { User } from "@/hooks/useSession"
import { usePlayers } from "@/context/PlayersContext";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditPlayer from "./EditPlayer";

const PlayersList = ({ user }: { user: User }) => {
  const { players, fetchPlayers } = usePlayers();

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return (
    <Table>
      <TableCaption>Pelaajat</TableCaption>
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
            {user.role === 'user' && (
              // Change this to !== user once done implementing
              <TableCell><EditPlayer player={player}/></TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PlayersList
