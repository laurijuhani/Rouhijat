"use client";
import { Game, Season } from '@/types/database_types';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseGameTime } from '@/utils/dateparser';
import AddGame from './AddGame';
import AddScore from './score/AddScore';
import { Button } from '../ui/button';
import ModifyGame from './score/ModifyGame';
import { TrashIcon } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import SeasonSelector from './score/forms/SeasonSelector';
import SeasonsForm from './score/forms/SeasonsForm';
import Fetch from '@/utils/fetch';
import Cookies from 'js-cookie';

const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [modify, setModify] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchgames = async () => {
      const data = await Fetch.get<Game[]>(process.env.NEXT_PUBLIC_BACKEND_URL + '/games');
      setGames(data);
    };

    const fetchSeasons = async () => {
      const data = await Fetch.get<Season[]>(process.env.NEXT_PUBLIC_BACKEND_URL + '/seasons');
      setSeasons(data);

      setSelectedSeason(data.find((season) => season.active === true) || null);
    };

    fetchgames()
      .catch((error) => {
        console.error(error);
      });
    fetchSeasons()
      .catch((error) => {
        console.error(error);
      });
  }, []);


  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Haluatko varmasti poistaa pelin?');
    if (confirmDelete) {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/games/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`
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

      <div className='flex justify-between items-center ml-3 mr-3'>
        <Button variant='outline' className='h-[fit-content]' onClick={() => setModify(!modify)}>{modify ? 'Peruuta' : 'Muokkaa'}</Button>
        <SeasonSelector 
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
      </div>

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
          {games.filter((game) => game.seasonId === selectedSeason?.id).sort((a: Game, b: Game) => 
          new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())
          .map((game) => (
            <TableRow key={game.id}>
              {modify && <TableCell>
                <div className="flex flex-col md:flex-row h-full">
                    <ModifyGame game={game} setGames={setGames} seasons={seasons} />
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
      <div className='flex flex-col justify-center mt-6 w-[fit-content] mx-auto space-y-3'>
        <AddGame setGames={setGames} season={selectedSeason}/>
        <SeasonsForm seasons={seasons} setSeasons={setSeasons} />
      </div>
    </div>
  );
};

export default GamesList;
