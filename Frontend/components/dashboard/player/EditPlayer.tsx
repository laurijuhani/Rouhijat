import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Label } from "@/components/ui/label";
import { Player } from "@/types/database_types";
import React, { useState } from "react";
import Fetch from "@/utils/fetch";

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
      number === player.number.toString()
    ) {
      setIsDialogOpen(false);
      setIsLoading(false);
      return;
    }
    
    if (!name || !number || isNaN(parseInt(number))) {
      showToast('error', 'Virheelliset tiedot', 'Tarkista pelaajan nimi ja numero');
      setIsLoading(false);
      return;
    }


    try {
      await Fetch.put(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/players/${player.id}`,
        { name, nickname, number: parseInt(number) },
        {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      );

      setPlayers((prevPlayers) =>
        prevPlayers.map((p) => {
          if (p.id === player.id) {
            return { ...p, name, nickname, number: parseInt(number) };
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



  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Muokkaa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Muokkaa pelaajaa</DialogTitle>
          <DialogDescription>
            Muokkaa pelaajan {player.name} tietoja.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nimi
              </Label>
              <Input id="playername" defaultValue={player.name} className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Lempinimi
              </Label>
              <Input id="nickname" defaultValue={player.nickname || ''} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Numero
              </Label>
              <Input id="number" type='number' defaultValue={player.number.toString()} className="col-span-3"/>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-3 justify-end">
            {isLoading ? (
                <LoaderCircleIcon className="animate-spin" size={32} aria-hidden="true" />
            ) : (
              <>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={isLoading} className="max-w-[fit-content]">
                    Sulje
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleDelete}
                  disabled={isLoading}
                  data-loading={isLoading}
                  className="max-w-[fit-content] group relative disabled:opacity-100"
                  variant='destructive'
                  >
                  <span className="group-data-[loading=true]:text-transparent">Poista pelaaja</span>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  data-loading={isLoading}
                  className="max-w-[fit-content] group relative disabled:opacity-100"
                  >
                  <span className="group-data-[loading=true]:text-transparent">Tallenna</span>
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlayer;
