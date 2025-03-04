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
import { TrashIcon } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [modify, setModify] = useState(false);
  const { showToast } = useToast();

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


  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Haluatko varmasti poistaa pelin?');
    if (confirmDelete) {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/games/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (!res.ok) {
        console.error('Failed to delete game');
        showToast('error', 'Pelin poistaminen epäonnistui', 'Yritä uudelleen');
        return;
      }
      setGames(games.filter(game => game.id !== id));
      showToast('success', 'Peli poistettu', '');
      setModify(false);

    return;
    }
  }; 


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
          {games.sort((a: Game, b: Game) => 
          new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())
          .map((game) => (
            <TableRow key={game.id}>
              {modify && <TableCell>
                <div className="flex flex-col md:flex-row h-full">
                    <ModifyGame game={game} setGames={setGames} />
                    <Button variant="destructive" className='max-w-[46px] max-h-[30px] mt-2 md:mt-0 md:ml-2'
                      onClick={() => handleDelete(game.id)}
                    >
                      <TrashIcon className="opacity-60" size={13} aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>}
              <TableCell>{game.homeTeam} -- {game.awayTeam}</TableCell>
              <TableCell>{parseGameTime(game.gameDate)}</TableCell>
              <TableCell>
                {new Date(game.gameDate).getTime() < Date.now() ? (
                  game.homeScore === null && game.awayScore === null ? (
                    <AddScore game={game} setGames={setGames}/>
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
        <AddGame setGames={setGames}/>
      </div>
    </div>
  )
}

export default GamesList
