import { useToast } from "@/context/ToastContext";
import { Player } from "@/types/database_types";
import React, { useState } from "react";
import Fetch from "@/utils/fetch";
import EditForm from "./EditForm";

interface EditPlayerProps {
  player: Player;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const EditPlayer = ({ player, setPlayers, isLoading, setIsLoading }: EditPlayerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showToast } = useToast();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.target as HTMLFormElement;
    const name = form.playername.value;
    const nickname = form.nickname.value;
    const number = form.number.value;

    if (
      name === player.name &&
      nickname === player.nickname &&
      number === player.number?.toString()
    ) {
      setIsDialogOpen(false);
      setIsLoading(false);
      return;
    }
    
    if (!name || (number && isNaN(parseInt(number)))) {
      showToast('error', 'Virheelliset tiedot', 'Tarkista pelaajan nimi ja numero');
      setIsLoading(false);
      return;
    }


    try {
      await Fetch.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/players/${player.id}`,
        { name, nickname, number: parseInt(number) || null },
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      );

      setPlayers((prevPlayers) =>
        prevPlayers.map((p) => {
          if (p.id === player.id) {
            return { ...p, name, nickname, number: parseInt(number) || null };
          }
          return p;
        })
      );
      setIsDialogOpen(false);
      showToast('success', 'Pelaaja muokattu', 'Pelaajan tiedot on muokattu onnistuneesti');
    } catch  {
      showToast('error', 'Pelaajan muokkaaminen epäonnistui', 'Yritä myöhemmin uudelleen');
    }
    setIsLoading(false);
  };

  
  const handleDelete = async () => {
    if (window.confirm('Haluatko varmasti poistaa pelaajan?')) {
      console.log('poistetaan');
      setIsLoading(true);

      try {
        await Fetch.delete(
          process.env.NEXT_PUBLIC_BACKEND_URL + `/players/${player.id}`,
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        );
        setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== player.id));
        setIsDialogOpen(false);
        showToast('success', 'Pelaaja poistettu', 'Pelaaja on poistettu onnistuneesti');
      } catch {
        showToast('error', 'Pelaajan poistaminen epäonnistui', 'Yritä myöhemmin uudelleen');
      }
      setIsLoading(false);
    }
  };



  return <EditForm 
    type="Pelaaja"
    player={player}
    isLoading={isLoading}
    handleDelete={handleDelete}
    handleSubmit={handleSubmit}
    isDialogOpen={isDialogOpen}
    setIsDialogOpen={setIsDialogOpen}
  />; 
};

export default EditPlayer;
