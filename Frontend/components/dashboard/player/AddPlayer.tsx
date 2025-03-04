import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/context/ToastContext";
import { Player } from "@/types/database_types";

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


    if (window.confirm('Lisätäänkö pelaaja?')) {
      console.log('Lisätään');

      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, nickname, number: parseInt(number) })
      });

      if (!response.ok) {
        console.log(response);
        showToast('error', 'Pelaajan lisääminen epäonnistui', '');
        setIsDialogOpen(false);
        setIsLoading(false);
        return;
      }

      const id = await response.json();
      
      setPlayers((prevPlayers) => {
        return [...prevPlayers, { name, nickname, number: parseInt(number), id, games: 0, points: { goals: 0, assists: 0 } }];
      });
      showToast('success', 'Pelaaja lisätty', '');
      setIsDialogOpen(false);
      setIsLoading(false);
    };
  }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Lisää pelaaja</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lisää uusi pelaaja</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nimi
            </Label>
            <Input id="name" placeholder="Pakollinen" className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Lempinimi
            </Label>
            <Input id="nickname"  className="col-span-3" onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">
              Numero
            </Label>
            <Input id="number" placeholder='Pakollinen' type='number' className="col-span-3" onChange={(e) => setNumber(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-3 justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading} className="max-w-[fit-content]">
              Sulje
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            data-loading={isLoading}
            className="max-w-[fit-content] group relative disabled:opacity-100"
          >
            <span className="group-data-[loading=true]:text-transparent">Lisää pelaaja</span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddPlayer
