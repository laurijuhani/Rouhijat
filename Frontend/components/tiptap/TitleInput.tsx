import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TitleInputProps {
  title: string; 
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const TitleInput = ({ title, setTitle }: TitleInputProps) => {
  return (
    <div>
      <Label htmlFor="title">
        Vaadittu kohta <span className="text-destructive">*</span>
      </Label>
      <Input 
        id="title" 
        placeholder="Nimi"  
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required 
      />
    </div>
  );
};

export default TitleInput;
