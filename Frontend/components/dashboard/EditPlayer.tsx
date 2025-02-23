import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Player } from "@/types/basicTypes"
import { useState } from "react"



const EditPlayer = ({ player }: { player: Player }) => {
  const [name, setName] = useState(player.name); 
  const [nickname, setNickname] = useState(player.nickname || '');
  const [number, setNumber] = useState(player.number.toString());


  const handleSubmit = () => {
    // TODO:  Send a PUT request to the backend with the updated player data
    if (window.confirm('Haluatko varmasti tallentaa muutokset?')) {
      console.log('tallennetaan');
      console.log(name, nickname, number);
    };
  };

  const handleDelete = () => {
    // TODO: Send a DELETE request to the backend to delete the player
    if (window.confirm('Haluatko varmasti poistaa pelaajan?')) {
      console.log('poistetaan');
    }
  };



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Muokkaa pelaajaa</DialogTitle>
          <DialogDescription>
            Muokkaa pelaajan {player.name} tietoja.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nimi
            </Label>
            <Input id="name" defaultValue={player.name} className="col-span-3" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Lempinimi
            </Label>
            <Input id="nickname" defaultValue={player.nickname || ''} className="col-span-3" onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">
              Numero
            </Label>
            <Input id="number" type='number' defaultValue={player.number.toString()} className="col-span-3" onChange={(e) => setNumber(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-3 justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="max-w-[fit-content]">
              Sulje
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} className="max-w-[fit-content]">
            Poista pelaaja
          </Button>
          <Button onClick={handleSubmit} className="max-w-[fit-content]">
            Tallenna
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditPlayer
