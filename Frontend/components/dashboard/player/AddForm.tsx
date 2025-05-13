import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddFormProps {
  type: 'Pelaaja' | 'Maalivahti';
  setNickname: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handleSubmit: () => Promise<void>;
}

const AddForm = ({ 
  type, 
  setNickname, 
  setName, 
  setNumber,
  isDialogOpen,
  setIsDialogOpen,
  isLoading,
  handleSubmit
  }: AddFormProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Lisää {type}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lisää uusi {type}</DialogTitle>
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
            <span className="group-data-[loading=true]:text-transparent">Lisää {type}</span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddForm;
