"use client"
import { Game } from '@/types/database_types'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { parseGameTime } from '@/utils/dateparser';
import AddGame from './AddGame';
import AddScore from './score/AddScore';
import { Button } from '../ui/button';
import ModifyGame from './score/ModifyGame';

const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [modify, setModify] = useState(false);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/games')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      }
      )
      .then((data) => {
        setGames(data);        
      }
      )
      .catch((error) => {
        console.error(error);
      }
      );
  }, [])



  return (
    <div>

      <Button className='h-[fit-content] ml-2' onClick={() => setModify(!modify)}>{modify ? 'Peruuta' : 'Muokkaa'}</Button>

      <Table>
        <TableCaption>Pelit</TableCaption>
        <TableHeader>
          <TableRow>
            {modify && <TableHead>Muokkaa</TableHead>}
            <TableHead>Peli</TableHead>
            <TableHead>Päivämäärä</TableHead>
            <TableHead>Tulos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              {modify && <TableCell><ModifyGame game={game} setGames={setGames}/></TableCell>}
              <TableCell>{game.homeTeam} -- {game.awayTeam}</TableCell>
              <TableCell>{parseGameTime(game.gameDate)}</TableCell>
              <TableCell>
                {new Date(game.gameDate).getTime() < Date.now() ? (
                  game.homeScore === null && game.awayScore === null ? (
                    <AddScore game={game} />
                  ) : (
                    `${game.homeScore || 0} - ${game.awayScore || 0}`
                  )
                ) : (
                  'Ei pelattu'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-center mt-6'>
        <AddGame />
      </div>
    </div>
  )
}

export default GamesList
