import { useToast } from "@/context/ToastContext";
import { Goalie } from "@/types/database_types";
import React, { useState } from "react";
import Fetch from "@/utils/fetch";
import EditForm from "./EditForm";

interface EditGoalieProps {
  goalie: Goalie;
  setGoalies: React.Dispatch<React.SetStateAction<Goalie[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const EditGoalie = ({ goalie, setGoalies, isLoading, setIsLoading }: EditGoalieProps) => {
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
      name === goalie.name &&
      nickname === goalie.nickname &&
      number === goalie.number?.toString()
    ) {
      setIsDialogOpen(false);
      setIsLoading(false);
      return;
    }
    
    if (!name || ( number && isNaN(parseInt(number)))) {
      showToast('error', 'Virheelliset tiedot', 'Tarkista maalivahdin nimi ja numero');
      setIsLoading(false);
      return;
    }


    try {
      await Fetch.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/goalies/${goalie.id}`,
        { name, nickname, number: parseInt(number) },
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      );

      setGoalies((prevGoalies) =>
        prevGoalies.map((p) => {
          if (p.id === goalie.id) {
            return { ...p, name, nickname, number: parseInt(number) };
          }
          return p;
        })
      );
      setIsDialogOpen(false);
      showToast('success', 'Maalivahti muokattu', 'Maalivahdin tiedot on muokattu onnistuneesti');
    } catch  {
      showToast('error', 'Maalivahdin muokkaaminen epäonnistui', 'Yritä myöhemmin uudelleen');
    }
    setIsLoading(false);
  };

  
  const handleDelete = async () => {
    if (window.confirm('Haluatko varmasti poistaa Maalivahdin?')) {
      console.log('poistetaan');
      setIsLoading(true);

      try {
        await Fetch.delete(
          process.env.NEXT_PUBLIC_BACKEND_URL + `/goalies/${goalie.id}`,
          {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        );
        setGoalies((prevGoalies) => prevGoalies.filter((p) => p.id !== goalie.id));
        setIsDialogOpen(false);
        showToast('success', 'Maalivahti poistettu', 'Maalivahti on poistettu onnistuneesti');
      } catch {
        showToast('error', 'Maalivahdin poistaminen epäonnistui', 'Yritä myöhemmin uudelleen');
      }
      setIsLoading(false);
    }
  };



  return <EditForm 
    type="Maalivahti"
    player={goalie}
    isLoading={isLoading}
    handleDelete={handleDelete}
    handleSubmit={handleSubmit}
    isDialogOpen={isDialogOpen}
    setIsDialogOpen={setIsDialogOpen}
  />; 
};

export default EditGoalie;
