import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { Goalie } from "@/types/database_types";
import Fetch from "@/utils/fetch";
import AddForm from "./AddForm";

interface AddGoalieProps {
  setGoalies: React.Dispatch<React.SetStateAction<Goalie[]>>;
}

const AddGoalie = ({ setGoalies }: AddGoalieProps) => {
  const [name, setName] = useState(''); 
  const [nickname, setNickname] = useState('');
  const [number, setNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!name || !number) {
      showToast('error', 'Nimi ja numero ovat pakollisia', '');
      setIsLoading(false);
      return;
    }

    if (isNaN(parseInt(number))) {
      showToast('error', 'Numero on pakollinen ja sen tulee olla numero', '');
      setIsLoading(false);
      return;
    }


    if (window.confirm('Lisätäänkö Maalivahti?')) {
      console.log('Lisätään');

      try {
        const { json } = await Fetch.post<number>(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/goalies',
          { name, nickname, number: parseInt(number) },
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        );
        const id = await json;

        setGoalies((prevGoalies) => {
          return [...prevGoalies, { id, name, nickname, number: parseInt(number), games: []}];
        });
        showToast('success', 'Maalivahti lisätty', '');
        setIsDialogOpen(false);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        showToast('error', 'Maalivahdin lisääminen epäonnistui', '');
        setIsDialogOpen(false);
        setIsLoading(false);
      }
    };
  };


  return <AddForm 
    type="Maalivahti"
    setNickname={setNickname}
    setName={setName}
    setNumber={setNumber}
    isDialogOpen={isDialogOpen}
    setIsDialogOpen={setIsDialogOpen}
    isLoading={isLoading}
    handleSubmit={handleSubmit}
  />;
};

export default AddGoalie;
