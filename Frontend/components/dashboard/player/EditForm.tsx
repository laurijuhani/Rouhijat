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
import { Label } from "@/components/ui/label";
import { BaseInfo } from "@/types/database_types";
import React from "react";

interface EditFormProps {
  type: 'Pelaaja' | 'Maalivahti';
  player: BaseInfo;
  isLoading: boolean;
  handleDelete: () => Promise<void>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const EditForm = ({ player, isLoading, type, handleSubmit, handleDelete, isDialogOpen, setIsDialogOpen }: EditFormProps) => {


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Muokkaa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Muokkaa {type}a</DialogTitle>
          <DialogDescription>
            Muokkaa {type === 'Maalivahti' ? 'maalivahdin' : 'pelaajan'} {player.name} tietoja.
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
              <Input id="number" type='number' defaultValue={player.number?.toString()} className="col-span-3"/>
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
                  <span className="group-data-[loading=true]:text-transparent">Poista {type}</span>
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

export default EditForm;
