import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Player } from "@/types/database_types";
import Fetch from "@/utils/fetch";
import AddForm from "./AddForm";
import Cookies from "js-cookie";

interface AddPlayerProps {
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const AddPlayer = ({ setPlayers }: AddPlayerProps) => {
  const [name, setName] = useState(''); 
  const [nickname, setNickname] = useState('');
  const [number, setNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!name) {
      showToast('error', 'Nimi on pakollinen', '');
      setIsLoading(false);
      return;
    }

    if (number && isNaN(parseInt(number))) {
      showToast('error', 'Virheellinen numero', '');
      setIsLoading(false);
      return;
    }


    if (window.confirm('Lisätäänkö pelaaja?')) {
      try {
        const { json } = await Fetch.post<number>(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/players',
          { name, nickname, number: parseInt(number) || null },
          {
            Authorization: `Bearer ${Cookies.get('token')}`,
          }
        );
        const id = await json;

        setPlayers((prevPlayers) => {
          return [...prevPlayers, { name, nickname, number: parseInt(number) || null, id, games: 0, points: { goals: 0, assists: 0, pm: 0 } }];
        });
        showToast('success', 'Pelaaja lisätty', '');
        setIsDialogOpen(false);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        showToast('error', 'Pelaajan lisääminen epäonnistui', '');
        setIsDialogOpen(false);
        setIsLoading(false);
      }
    };
  };


  return <AddForm 
    type="Pelaaja"
    setNickname={setNickname}
    setName={setName}
    setNumber={setNumber}
    isDialogOpen={isDialogOpen}
    setIsDialogOpen={setIsDialogOpen}
    isLoading={isLoading}
    handleSubmit={handleSubmit}
  />;
};

export default AddPlayer;
